import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

/**
 * Generates SHA-1 signature using Web Crypto API (supported natively across Edge/Workers/Node.js)
 */
async function generateSha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Universal Media Upload Endpoint (Cloudinary REST API)
 * Automatically supports Signed Upload (API Key & Secret) or Unsigned Preset Upload.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || !('name' in file)) {
      return apiError('File tidak ditemukan atau format tidak valid', 400);
    }

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      (globalThis as Record<string, unknown>).NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      'riwomz8g';
    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      (globalThis as Record<string, unknown>).CLOUDINARY_API_KEY ||
      '';
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ||
      (globalThis as Record<string, unknown>).CLOUDINARY_API_SECRET ||
      '';
    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      (globalThis as Record<string, unknown>).CLOUDINARY_UPLOAD_PRESET ||
      '';

    if (!cloudName) {
      return apiError('Konfigurasi Cloudinary Cloud Name belum diatur', 500);
    }

    // Prepare Cloudinary FormData payload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);

    // If API Key and Secret are available, use signed secure upload
    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const stringToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = await generateSha1(stringToSign);

      cloudinaryFormData.append('api_key', String(apiKey));
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('signature', signature);
    } else if (uploadPreset) {
      cloudinaryFormData.append('upload_preset', String(uploadPreset));
    } else {
      return apiError('Kredensial Cloudinary tidak lengkap untuk penandatanganan berkas', 500);
    }

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary Upload Failed:', errorText);
      return apiError('Gagal mengunggah berkas ke Cloudinary', 502);
    }

    const result = (await uploadResponse.json()) as {
      secure_url: string;
      public_id: string;
      format: string;
      bytes: number;
    };

    return apiSuccess(
      {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        sizeBytes: result.bytes,
      },
      'Berkas berhasil diunggah ke Cloudinary',
      201
    );
  } catch (error: unknown) {
    console.error('Media Upload Error:', error);
    return apiError('Terjadi kesalahan internal saat mengunggah berkas', 500);
  }
}

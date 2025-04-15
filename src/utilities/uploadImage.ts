import { supabase } from "../providers/supabase"; 

export const uploadImage = async (file: Blob, filename: string) => {
  const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME!; 

  const { error } = await supabase
    .storage
    .from(bucketName)
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error("Upload Error:", error.message);
    throw new Error('Error uploading image');
  }

  const { data: urlData } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filename);

  if (!urlData.publicUrl) {
    console.error("Error: public URL is empty");
    throw new Error('Failed to retrieve public URL');
  }

  return urlData.publicUrl;
};

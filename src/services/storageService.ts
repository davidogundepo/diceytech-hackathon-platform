import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const uploadUserAvatar = async (file: File, userId: string): Promise<string> => {
  const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const uploadProjectImage = async (file: File, userId: string): Promise<string> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `projects/${userId}/${timestamp}-${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
};

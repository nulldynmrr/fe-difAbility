import request from "@/utils/request";

// export const uploadImage = (file, onProgress) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   return request.post("/files/upload/image", formData, {
//     onUploadProgress: (e) => {
//       if (onProgress) {
//         const percent = Math.round((e.loaded * 100) / e.total);
//         onProgress(percent);
//       }
//     },
//   });
// };

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/files/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const path = await res.text();
  return { data: { path } };
}

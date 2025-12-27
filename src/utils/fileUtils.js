export function getFileUrl(path) {
  if (!path) return null;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  const encodedPath = encodeURIComponent(cleanPath);

  return `${process.env.NEXT_PUBLIC_HOST}/api/files/view?path=${encodedPath}`;
}

export function transformCompanyData(companyData) {
  if (!companyData) return null;

  return {
    ...companyData,
    logoImagePath: getFileUrl(companyData.logoImagePath),
  };
}

export function transformUserProfileData(userData) {
  if (!userData) return null;

  return {
    ...userData,
    ppImgPath: getFileUrl(userData.ppImgPath),
    cvFilePath: getFileUrl(userData.cvFilePath),
    certifFilePaths:
      userData.certifFilePaths?.map((path) => getFileUrl(path)) || [],
  };
}

export function transformJobData(jobData) {
  if (!jobData) return null;

  return {
    ...jobData,
    company: jobData.company
      ? {
          ...jobData.company,
          logoImagePath: getFileUrl(jobData.company.logoImagePath),
        }
      : null,
  };
}

export function transformJobsList(jobs) {
  if (!Array.isArray(jobs)) return [];
  return jobs.map((job) => transformJobData(job));
}

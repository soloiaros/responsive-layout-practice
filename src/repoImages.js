export default async function repoImages(repo, opts = {}) {
  const token = opts.token || opts.access_token; 
  const branch = opts.branch || 'main';

  const url = new URL(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);

  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`; // Required if reading private repos
  }

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const imagePattern = /\.(png|gif|jpg)$/i;
    let images = [];

    if (data?.tree) {
      images = data.tree
        .filter(image => !!image.path.match(imagePattern))
        .map(image => {
          image.rawgit = `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${image.path}`;
          return image;
        });
    }
    return images;
  } catch (error) {
    console.error("Failed to fetch repo images:", error);
    throw error;
  }
}
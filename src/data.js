import './plain.css';
import cardPlaceholderImage from './resources/project-placeholder.png';
import repoImages from './repoImages.js';

const getGHAccountData = async (username) => {
  const pinnedResponse = await fetch(`https://pinned.berrysauce.dev/get/${username}`);
  const pinnedData = await pinnedResponse.json();
  const userReposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  const userReposData = await userReposResponse.json();
  return { pinnedData, userReposData };
}

const loadCards = async () => {
  const projectContainer = document.querySelector('.projects-container');
  
  const { pinnedData, userReposData } = await getGHAccountData('soloiaros');
  for (let project of pinnedData) {
    let previewImage = await repoImages(`soloiaros/${project.name}`);
    previewImage = previewImage[0] ? previewImage[0].rawgit : cardPlaceholderImage;
    const cardElement = `
      <div class="card">
        <div class="image-container" aria-hidden="true">
          <img src="${previewImage}">
          <h3>${project.name.split('-').map(word => word.toUpperCase()).join(' ')}</h3>
        </div>
        <div class="info-container">
          <div class="top-line">
            <div class="tags-container">
              <span class="tag ${project.language.toLowerCase()}">${project.language}</span>
            </div>
            <div class="external-links">
              <a href="https://github.com/soloiaros/${project.name}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
              </a>
              <a href="${userReposData.length > 2 ? userReposData.find(repo => repo.name === project.name).homepage : '#'}">
                <svg class="external" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g>
                </svg>
              </a>
            </div>
          </div>
          <div class="bottom-line">
            <p>${project.description}</p>
          </div>
        </div>
      </div>
    `

    projectContainer.innerHTML += cardElement;
  }
}

loadCards();
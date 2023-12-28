//homepage variables
const api_key = "0449d1c16a026ad5d131280a68140ea5";
var homepageWelcomeText = document.querySelector("#homepageWelcomeText");
var movieListContent = document.querySelector("#movieListContent");
var activeSession = JSON.parse(localStorage.getItem("activeSession"));
var movies = undefined;

//set welcome to user's name
homepageWelcomeText.innerHTML = "Welcome " + activeSession.name;

//get instance from XMLHttpRequest
var httpReq = new XMLHttpRequest();
//open channel
httpReq.open(
  "get",
  `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${api_key}`
);
//send request
httpReq.send();
//get response
httpReq.addEventListener("readystatechange", function () {
  if (httpReq.readyState == 4) {
    movies = JSON.parse(httpReq.response).results;

    let htmlContent = "";
    movies.forEach((element) => {
      htmlContent += `<div class="col-lg-4">
        <div class="card shadow text-center overflow-hidden p-0">
            <picture>
              <img class="w-100"
                src="https://image.tmdb.org/t/p/original/${element.poster_path}?api_key=${api_key}"
                alt=""
              />
            </picture>
            <h3>${element.title}</h3>
            <p>${element.overview}</p>
        </div>
      </div>
      `;
    });
    movieListContent.innerHTML = htmlContent;
  }
});

function logout() {
  localStorage.removeItem("activeSession");

  setTimeout(function () {
    window.location = "index.html";
  }, 1000);
}

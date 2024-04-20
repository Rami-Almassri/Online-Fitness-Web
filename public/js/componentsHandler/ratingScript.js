const ratingStars = [...document.getElementsByClassName("rating-star")]
const resultSection = document.getElementById("rating-result")

function executeRating(stars, resultSection){
    const starClassActive = "fas fa-star rating-star cursor-pointer text-2xl"
    const starClassInactive = "far fa-star rating-star cursor-pointer text-2xl"
    const starsLen = stars.length

    stars.map((star) => {
        star.onclick = () => {
            let i = stars.indexOf(star)

            if(star.className === starClassInactive) {
                updateRating(resultSection, i+1)
                for(i; i>= 0; i--) stars[i].className = starClassActive
            } else {
                updateRating(resultSection, i)
                for(i; i<starsLen; ++i) stars[i].className = starClassInactive
            }

        }
    })

}

function updateRating(resultSection, newRes){
    resultSection.innerHTML = newRes
}

executeRating(ratingStars, resultSection)
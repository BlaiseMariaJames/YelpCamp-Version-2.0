const heading = document.querySelector("#heading");
const optionsHolder = document.querySelector(".categories");
const campgroundContainers = document.querySelectorAll(".campground");
const options = { "Latest": { sortBy: "latest" }, "Earliest": { sortBy: "earliest" }, "Top Rated": { sortBy: "top-rated" }, "Premium": { sortBy: "premium" }, "Economic": { sortBy: "economic" }, "Title [A-Z]": { sortBy: "title-asc" }, "Title [Z-A]": { sortBy: "title-desc" }, "Location [A-Z]": { sortBy: "location-asc" }, "Location [Z-A]": { sortBy: "location-desc" } };

optionsHolder.addEventListener("change", (handleSortByChange) => {
    const { value } = handleSortByChange.target;
    for (const campground of campgroundContainers) {
        if (!campground.classList.contains("d-none")) {
            campground.classList.add("d-none");
        }
    }
    const campground = document.querySelector(`#${options[value].sortBy}`);
    campground.classList.remove("d-none");
    heading && (heading.innerHTML = `${value}`);
});
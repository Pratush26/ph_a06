let container = document.querySelector("#shop > div");
let categoryContainer = document.querySelector("#shop > aside");
let cartContainer = document.querySelector("#shop > aside:last-child");
let cartBox = document.getElementById("cartBox");

//  price calculator
let calculatePrice = () => {
    let cartPrice = 0;
    cartBox.querySelectorAll("p > span").forEach(e => {
        cartPrice += parseInt(e.innerText)
    })
    cartContainer.querySelector("div > p:last-child > span").innerText = cartPrice;
}

//  plant filtering functionality
async function allPlants(url) {
    container.innerHTML = "";
    let data = await (await fetch(url)).json();
    data.plants.map(e => {
        let card = document.createElement("span");
        card.className = "bg-white rounded-lg p-4 flex flex-col gap-2 justify-evenly h-full";
        card.innerHTML = `<img src=${e.image} class="w-full aspect-video object-cover object-center bg-gray-300 rounded-lg">
                    <h6 class="font-semibold text-sm">${e.name}</h6>
                    <small class="text-gray-500 font-medium text-xs">${e.description}</small>
                    <span class="flex items-center justify-between my-3">
                        <span class="bg-emerald-100 p-1 rounded text-xs font-medium">${e.category}</span>
                        <p>৳<span>${e.price}</span></p>
                    </span>
                    <button
                        class="font-medium text-sm bg-[#15803D] hover:bg-[#126d33] text-white w-full px-4 py-2 rounded-full transition-all duration-300 transition-discrete">Add
                        to Cart</button>`;
        container.appendChild(card);
    })
}
allPlants("https://openapi.programming-hero.com/api/plants");

//  category buttons functions
async function allCategory(url) {
    let data = await (await fetch(url)).json();
    data.categories.map(e => {
        let card = document.createElement("button");
        card.className = "font-medium text-sm text-left hover:bg-[#15803D] hover:text-white w-full px-4 py-2 rounded transition-all duration-300 transition-discrete";
        card.innerText = `${e.category_name}`;
        card.onclick = () => allPlants(`https://openapi.programming-hero.com/api/category/${e.id}`);
        card.title = `${e.small_description}`
        categoryContainer.appendChild(card);
    })
}
allCategory("https://openapi.programming-hero.com/api/categories");

//  active button functionality
categoryContainer.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        categoryContainer.querySelectorAll("button").forEach(btn =>
            btn.classList.remove("active")
        );
        e.target.classList.add("active");
    }
});

//  add to cart functionality
container.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        let card = document.createElement("div");
        card.className = "flex items-center justify-between bg-[#CFF0DC] rounded p-2";
        card.innerHTML = `<span>
                            <small class="font-semibold">${e.target.parentElement.querySelector("h6").innerText}</small>
                            <p class="text-sm text-gray-600">৳<span>${e.target.parentElement.querySelector("span > p > span").innerText}</span> x 1</p>
                        </span>
                        <button>x</button>`;
        cartBox.appendChild(card);
    }
    calculatePrice();
});

//  remove from cart
cartBox.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    e.target.parentElement.remove();
    calculatePrice();
  }
});

//  checkout button functionality
cartContainer.querySelector("button").addEventListener("click", () => {
    cartBox.innerHTML = "";
    cartContainer.querySelector("div > p:last-child > span").innerText = 0
})

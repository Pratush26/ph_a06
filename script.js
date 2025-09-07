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
    container.innerHTML = `<span class="loading col-span-3 mx-auto loading-dots loading-lg"></span>`;
    let data = await (await fetch(url)).json();
    container.innerHTML = "";
    data.plants.map(e => {
        let card = document.createElement("span");
        card.className = "bg-white rounded-lg p-4 flex flex-col gap-2 justify-evenly h-full";
        card.innerHTML = `<img src=${e.image} 
                                loading="lazy" 
                                class="w-full aspect-video object-cover object-center bg-gray-300 rounded-lg">
                    <h6 data-id="${e.id}" class="font-semibold text-sm hover:cursor-pointer">${e.name}</h6>
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
    let loader = document.createElement("span");
    loader.className = "loading loading-dots loading-md";
    categoryContainer.appendChild(loader);
    let data = await (await fetch(url)).json();
    loader.remove();
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

//  create modal
let createModal = async (e) => {
    let data = await (await fetch(`https://openapi.programming-hero.com/api/plant/${e}`)).json();
    console.log(data)
    document.getElementById("my_modal_5").innerHTML = `<div class="modal-box">
        <section class="grid grid-cols-2 place-content-center gap-3">
            <img src="${data.plants.image}" class="h-full object-contain rounded-lg">
            <div class="flex flex-col items-center justify-evenly gap-1 h-full">
                <h6 class="font-semibold">${data.plants.name}</h6>
                <small class="text-gray-500 font-medium text-sm">${data.plants.description}</small>
                <div class="modal-action flex flex-col items-center justify-center w-full">
                    <span class="flex items-center justify-between my-3 w-full">
                        <span class="bg-emerald-100 p-1 rounded text-xs font-medium">${data.plants.category}</span>
                        <p>৳<span>${data.plants.price}</span></p>
                    </span>
                    <form method="dialog">
                        <button class="btn btn-neutral">Close</button>
                    </form>
                </div>
            </div>
        </section>
    </div>`;
    my_modal_5.showModal();
}
//  add to cart functionality   &&  tree details functionality
container.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        let card = document.createElement("div");
        card.className =
            "flex items-center justify-between bg-[#CFF0DC] rounded p-2 animate-[fadeDown_0.3s_ease-out]";
        card.innerHTML = `<span>
                            <small class="font-semibold">${e.target.parentElement.querySelector("h6").innerText}</small>
                            <p class="text-sm text-gray-600">
                                ৳<span>${e.target.parentElement.querySelector("span > p > span").innerText}</span> x 1
                             </p>
                        </span>
                        <button>x</button>`;
        cartBox.appendChild(card);
        calculatePrice();
    }
    else if (e.target.matches("h6")) {
        createModal(e.target.dataset.id);
    }
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
    let price = cartContainer.querySelector("div > p:last-child > span").innerText;
    if (price > 0) alert(`Your order of is ৳${price} successfully submitted`);
    cartBox.innerHTML = "";
    cartContainer.querySelector("div > p:last-child > span").innerText = 0
})

//  donation form
document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Thank you ${e.target.name.value} for donating with us`);
    e.target.reset();
})
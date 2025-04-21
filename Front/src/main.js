import "./style.css";
const $form = document.getElementById("search-form");

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = document.querySelector('input[name="keyword"]').value;
  const submitButton = document.querySelector('input[type="submit"]');
  const container = document.getElementById("card-container");
  const loader = document.getElementById("loader");

  const url = `http://localhost:8080/api/scrape?keyword=${keyword}`;

  if (!keyword) {
    return alert("Please enter a keyword");
  }

  submitButton.disabled = true;
  loader.classList.remove("d-none");
  container.classList.add("d-none");
  try {
    const result = await fetch(url);
    const { products } = await result.json();
    container.innerHTML = "";
    products.forEach((product) => {
      container.innerHTML += `<div class="col-sm-6 col-md-4 col-lg-3 product-card-container">
            <div class="card h-100">
           
              <img
                src="${product.imageUrl}"
                class="card-img-top"
                alt="${product.title}"
              />
             
              <div class="card-header">
                <small class="text-body-secondary rating" title="Rating"
                  >${product.rating}</small
                >
                <small class="text-body-secondary reviews" title="Reviews">${product.reviews}</small>
              </div>
              <div class="card-body">
                <h5 class="card-title">
                <a href="${product.productUrl}" target="_blank" rel="noopener noreferrer">
                ${product.title}
                </a>
                </h5>
              </div>
            </div>
          </div>`;
    });
  } catch (error) {
    container.innerHTML =
      "<div id='error'>Hubo un error al cargar los productos</div>";
    console.log(error);
  } finally {
    loader.classList.add("d-none");
    container.classList.remove("d-none");
    submitButton.disabled = false;
  }
});

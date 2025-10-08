document.addEventListener('DOMContentLoaded', () => {
    // Array para armazenar os itens no carrinho
    let cart = [];

    // Elementos do DOM
    const cartButton = document.getElementById('btn-cart');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-btn');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const productList = document.getElementById('product-list');
    const filterCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');

    // --- Funções do Carrinho ---

    // 1. Atualiza a contagem e o total do carrinho
    function updateCart() {
        let total = 0;
        cartItemsList.innerHTML = ''; // Limpa a lista para reconstruir

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Seu carrinho está vazio.</li>';
        }

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity}x - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // 2. Adiciona item ao carrinho
    function addItemToCart(productId, productName, productPrice) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }

        updateCart();
        alert(`"${productName}" adicionado ao carrinho!`);
    }

    // 3. Evento para adicionar ao carrinho
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-cart')) {
            const card = e.target.closest('.product-card');
            const id = parseInt(e.target.dataset.id);
            const name = card.querySelector('.product-name').textContent;
            // Pega o preço e remove "R$" e vírgula para cálculo
            const priceText = card.querySelector('.product-price').textContent.replace('R$', '').replace(',', '.').trim();
            const price = parseFloat(priceText);

            addItemToCart(id, name, price);
        }
    });

    // --- Funções do Modal ---

    // 4. Abrir Modal
    cartButton.onclick = () => {
        cartModal.style.display = 'block';
    }

    // 5. Fechar Modal (botão X)
    closeButton.onclick = () => {
        cartModal.style.display = 'none';
    }

    // 6. Fechar Modal (clique fora)
    window.onclick = (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    }

    // --- Função de Filtro (Estilo Simples de Categorias) ---

    // 7. Aplica o filtro aos produtos
    function applyFilters() {
        const checkedFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.filter);

        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const marca = card.dataset.marca;
            const cor = card.dataset.cor;

            let matches = true;

            // Se houver filtros marcados, verifica se o card corresponde
            if (checkedFilters.length > 0) {
                const marcaFilters = checkedFilters.filter(f => ['nike', 'adidas', 'puma'].includes(f));
                const corFilters = checkedFilters.filter(f => ['branco', 'preto', 'colorido'].includes(f));

                let matchMarca = marcaFilters.length === 0 || marcaFilters.includes(marca);
                let matchCor = corFilters.length === 0 || corFilters.includes(cor);
                
                matches = matchMarca && matchCor;
            }
            
            card.style.display = matches ? 'block' : 'none';
        });
    }

    // 8. Event Listener para os filtros
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Inicializa o carrinho ao carregar a página
    updateCart();
    
    // Simulação: Função para gerar mais cards de produto via JS
    function generateProductCards() {
        const productsData = [
            { id: 2, name: "Air Runner Max", price: 289.90, marca: "nike", cor: "branco", img: "tenis2.jpg" },
            { id: 3, name: "Street Classic X", price: 159.90, marca: "adidas", cor: "branco", img: "tenis3.jpg" },
            { id: 4, name: "Puma Speed Pro", price: 349.90, marca: "puma", cor: "colorido", img: "tenis4.jpg" },
            { id: 5, name: "Básico Essential", price: 99.90, marca: "adidas", cor: "preto", img: "tenis5.jpg" },
        ];

        productsData.forEach(product => {
            const cardHTML = `
                <div class="product-card" data-marca="${product.marca}" data-cor="${product.cor}">
                    <img src="assets/img/${product.img}" alt="${product.name}">
                    <div class="product-info">
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                        <button class="btn-add-cart" data-id="${product.id}">Adicionar ao 🛒</button>
                    </div>
                </div>
            `;
            productList.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    // Chame a função para popular a grade com mais itens
    generateProductCards();

});
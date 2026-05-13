document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTableBody = document.querySelector('#product-table tbody');
    
    async function loadProducts() {
        try {
            const response = await fetch('/products');
            const products = await response.json();
            
            productTableBody.innerHTML = '';
            products.forEach(prod => {
                const row = `
                    <tr>
                        <td>${prod.id}</td>
                        <td>${prod.name}</td>
                        <td>${prod.quantity}</td>
                        <td>R${prod.price.toFixed(2)}</td>
                        <td>
                            <button onclick="deleteProduct(${prod.id})" style="background: red; padding: 5px; font-size: 12px;">Excluir</button>
                        </td>
                    </tr>
                `;
                productTableBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value),
            category_id: parseInt(document.getElementById('category_id').value),
            supplier_id: parseInt(document.getElementById('supplier_id').value)
        };

        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
                productForm.reset();
                loadProducts();
            } else {
                alert('Erro ao cadastrar produto. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            alert('Erro ao cadastrar produto. Por favor, tente novamente.');
        }
    });

    loadProducts();
});


window.deleteProduct = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        await fetch(`/products/${id}`, { method: 'DELETE' });
        loadProducts();
    }
}




    
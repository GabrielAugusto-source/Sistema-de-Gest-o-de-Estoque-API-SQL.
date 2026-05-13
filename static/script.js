document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTableBody = document.querySelector('#product-table tbody');

    // 1. FUNÇÃO PARA CARREGAR PRODUTOS (Lê do Banco)
    async function loadProducts() {
        try {
            const response = await fetch('/products/');
            const products = await response.json();

            productTableBody.innerHTML = ''; // Limpa a tabela

            products.forEach(prod => {
                const row = `
                    <tr>
                        <td>${prod.id}</td>
                        <td>${prod.name}</td>
                        <td>${prod.quantity}</td>
                        <td>R$ ${prod.price.toFixed(2)}</td>
                        <td>
                            <button class="btn-delete" onclick="deleteProduct(${prod.id})">Excluir</button>
                        </td>
                    </tr>
                `;
                productTableBody.innerHTML += row;
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }

    // 2. FUNÇÃO PARA SALVAR PRODUTO (Envia para o Banco)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 🛑 IMPEDE a página de recarregar

        const data = {
            name: document.getElementById('name').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value),
            category_id: parseInt(document.getElementById('category_id').value),
            supplier_id: parseInt(document.getElementById('supplier_id').value),
        };

        try {
            const response = await fetch('/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("🚀 Produto salvo com sucesso!");
                productForm.reset(); // Limpa os campos do form
                loadProducts(); // Atualiza a tabela automaticamente!
            } else {
                alert("❌ Erro ao salvar. Verifique se os IDs de Categoria e Fornecedor existem.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    });

    // 3. FUNÇÃO PARA DELETAR (Remove do Banco)
    window.deleteProduct = async (id) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                const response = await fetch(`/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("Produto removido!");
                    loadProducts(); // Recarrega a lista
                }
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    }

    // Inicia o sistema carregando os produtos
    loadProducts();
});

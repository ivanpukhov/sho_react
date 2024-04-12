import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Button, message } from 'antd';

const CategoriesModal = ({ shoppingListId, onAdded }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [isProductsVisible, setIsProductsVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('https://lll.ix-web.site/api/categories');
            setCategories(data);
        } catch (error) {
            console.error('Ошибка при загрузке категорий');
        }
    };

    const selectCategory = async (categoryId) => {
        try {
            const { data } = await axios.get(`https://lll.ix-web.site/api/categories/${categoryId}`);
            setProducts(data);
            setSelectedCategory(categoryId);
            setIsProductsVisible(true);
        } catch (error) {
            console.error('Ошибка при загрузке товаров категории');
        }
    };

    const addProductToList = async (productId) => {
        try {
            await axios.post(`https://lll.ix-web.site/api/shoppingLists/${shoppingListId}/products/${productId}`);
            message.success('Товар добавлен в список');
            onAdded();
            setIsProductsVisible(false);
        } catch (error) {
            message.error('Ошибка при добавлении товара в список');
        }
    };

    return (
        <>
            {!isProductsVisible ? (
                <List
                    dataSource={categories}
                    renderItem={category => (
                        <List.Item key={category.id} actions={[<Button onClick={() => selectCategory(category.id)}>Выбрать</Button>]}>
                            {category.name}
                        </List.Item>
                    )}
                />
            ) : (
                <>
                    <Button onClick={() => setIsProductsVisible(false)} style={{ marginBottom: 16 }}>
                        Назад к категориям
                    </Button>
                    <List
                        dataSource={products}
                        renderItem={product => (
                            <List.Item key={product.id} actions={[<Button onClick={() => addProductToList(product.id)}>Добавить в список</Button>]}>
                                {product.name}
                            </List.Item>
                        )}
                    />
                </>
            )}
        </>
    );
};

export default CategoriesModal;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, message } from 'antd';
import ShoppingLists from "./ShoppingLists";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('https://lll.ix-web.site/api/categories');
                setCategories(data);
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
                message.error('Не удалось загрузить категории');
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>

            <h2>Категории</h2>
            <List
                itemLayout="horizontal"
                dataSource={categories}
                renderItem={category => (
                    <List.Item>
                        <List.Item.Meta
                            title={<Link to={`/categories/${category.id}`}>{category.name}</Link>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CategoriesList;

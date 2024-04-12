import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { List, Button, Modal } from 'antd';
import CategoriesModal from './CategoriesModal';
import ProductCommentsModal from './ProductCommentsModal';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #f0f8ff;  // Светло-голубой пастельный фон
`;

const StyledList = styled(List)`
  background: #fff0f5;  // Светло-розовый пастельный фон
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
  background: #f0f8ff; // Светло-голубой пастельный фон для кнопок
  border: none;
  border: 1px solid black;
  color: black;
  &:hover {
    background: #add8e6;  // Более темный голубой при наведении
  }
`;

const ShoppingListDetails = () => {
    const { id } = useParams();
    const [shoppingList, setShoppingList] = useState({ name: '', Products: [] });
    const [isCategoriesModalVisible, setIsCategoriesModalVisible] = useState(false);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        fetchShoppingListDetails();
    }, []);

    const fetchShoppingListDetails = async () => {
        try {
            const response = await axios.get(`https://lll.ix-web.site/api/shoppingLists/${id}`);
            setShoppingList({ name: response.data.name, Products: response.data.Products || [] });
        } catch (error) {
            console.error('Ошибка при загрузке деталей списка покупок');
        }
    };

    const showCategoriesModal = () => {
        setIsCategoriesModalVisible(true);
    };

    const handleCategoriesModalClose = () => {
        setIsCategoriesModalVisible(false);
    };

    const showCommentsModal = (productId) => {
        setSelectedProductId(productId);
        setIsCommentsModalVisible(true);
    };

    const handleCommentsModalClose = () => {
        setIsCommentsModalVisible(false);
    };

    return (
        <Container>
            <h1>Список покупок: {shoppingList.name}</h1>
            <StyledList
                itemLayout="horizontal"
                dataSource={shoppingList.Products}
                renderItem={item => (
                    <List.Item
                        actions={[<StyledButton onClick={() => showCommentsModal(item.id)}>Комментарии</StyledButton>]}
                    >
                        <List.Item.Meta
                            title={<Link to={`/products/${item.id}`}>{item.name}</Link>}
                            description={`Цена: ${item.price} ${item.quantity ? `, Количество: ${item.quantity}` : ''}`}
                        />
                    </List.Item>
                )}
            />
            <StyledButton type="primary" onClick={showCategoriesModal}>
                Добавить товар
            </StyledButton>
            <Modal
                title="Выбор товара для списка"
                visible={isCategoriesModalVisible}
                onCancel={handleCategoriesModalClose}
                footer={null}
                width={800}
            >
                <CategoriesModal shoppingListId={id} onAdded={fetchShoppingListDetails} />
            </Modal>
            <ProductCommentsModal
                isVisible={isCommentsModalVisible}
                onClose={handleCommentsModalClose}
                productId={selectedProductId}
                userId={localStorage.getItem('userId')}
            />
        </Container>
    );
};

export default ShoppingListDetails;

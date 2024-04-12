import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, List, message, Modal } from 'antd';
import styled from 'styled-components';

const StyledList = styled(List)`
  background: #f0f8ff; // Светло-голубой пастельный фон
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  background: #e6e6fa; // Лавандовый фон для кнопок
  margin: 20px 0 40px;  // Отступ снизу
  color: black;
  border: 1px solid black;
  
  &:hover {
    background-color: #b3b3f0;
  }
`;

const Container = styled.div`
  background: #f7f7ff; // Светло-лиловый пастельный фон
`;

const ShoppingLists = () => {
    const { familyId } = useParams();
    const navigate = useNavigate();
    const [shoppingLists, setShoppingLists] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const { data } = await axios.get(`http://192.168.92.34:3000/api/shoppingLists/family/${familyId}`);
            setShoppingLists(data);
        } catch (error) {
            message.error('Ошибка при загрузке списков покупок');
        }
    };

    const showCreateListModal = () => {
        setIsModalVisible(true);
    };

    const handleCreateList = async () => {
        if (!newListName) {
            message.error('Введите название списка');
            return;
        }
        try {
            const { data } = await axios.post('http://192.168.92.34:3000/api/shoppingLists', { name: newListName, familyId });
            setShoppingLists([...shoppingLists, data]);
            setNewListName('');
            setIsModalVisible(false);
            message.success('Список успешно создан');
        } catch (error) {
            message.error('Ошибка при создании списка покупок');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewListName('');
    };

    return (
        <Container>
            <StyledList
                header={<div>Списки покупок семьи</div>}
                bordered
                dataSource={shoppingLists}
                renderItem={list => (
                    <List.Item key={list.id}>
                        <Link to={`/shoppingLists/${list.id}`}>{list.name}</Link>
                    </List.Item>
                )}
            />
            <StyledButton type="primary" onClick={showCreateListModal}>
                Создать список
            </StyledButton>
            <Modal title="Новый список покупок" visible={isModalVisible} onOk={handleCreateList} onCancel={handleCancel}>
                <Input placeholder="Название списка" value={newListName} onChange={e => setNewListName(e.target.value)} />
            </Modal>
        </Container>
    );
};

export default ShoppingLists;

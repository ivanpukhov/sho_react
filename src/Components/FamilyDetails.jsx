import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, Button, Modal, message } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import ShoppingLists from "./ShoppingLists";
import InputMask from 'react-input-mask';

const StyledContainer = styled.div`
  padding: 20px;
  background: #fafafa;
`;

const StyledList = styled(List)`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  background: #e6e6fa;
  color: black;
  margin-top: 10px;
  &:hover {
    background-color: #b3b3f0;
  }
`;

const FamilyDetails = () => {
    const { familyId } = useParams();
    const [family, setFamily] = useState({ name: '', Phones: [] });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    useEffect(() => {
        fetchFamilyDetails();
    }, []);

    const fetchFamilyDetails = async () => {
        try {
            const { data } = await axios.get(`http://192.168.92.34:3000/api/families/${familyId}`);
            setFamily(data);
        } catch (error) {
            message.error('Ошибка при загрузке деталей семьи');
        }
    };

    const removeMember = async (phoneId) => {
        try {
            await axios.delete(`http://192.168.92.34:3000/api/families/removeMember`, {
                data: { phoneId, familyId }
            });
            fetchFamilyDetails();
            message.success('Член семьи удален');
        } catch (error) {
            message.error('Не удалось удалить члена семьи');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (newPhoneNumber.match(/\d/g) && newPhoneNumber.match(/\d/g).length === 11) {
            checkPhoneNumber(newPhoneNumber); // Проверка номера при достижении 11 цифр
        }
    }, [newPhoneNumber]);

    const checkPhoneNumber = async (phoneNumber) => {
        try {
            const formattedPhoneNumber = phoneNumber.replace(/\D+/g, '');
            const response = await axios.post('http://192.168.92.34:3000/api/users/checkPhoneNumber', { phoneNumber: formattedPhoneNumber });
            if (!response.data.exists) {
                message.error('Номер телефона не зарегистрирован');
            } else {
                message.success('Номер телефона подтвержден');
                setIsModalVisible(false);
                fetchFamilyDetails();
            }
        } catch (error) {
            message.error('Ошибка при проверке номера телефона');
        }
    };

    return (
        <StyledContainer>
            <h1>Детали семьи: {family.name}</h1>
            <ShoppingLists />

            <StyledList
                dataSource={family.Phones}
                renderItem={phone => (
                    <List.Item
                        actions={[<StyledButton type="link" onClick={() => removeMember(phone.id)}>Удалить</StyledButton>]}
                    >
                        {phone.phoneNumber}
                    </List.Item>
                )}
            />
            <StyledButton type="primary" onClick={showModal}>
                Добавить участника
            </StyledButton>
            <Modal title="Добавить участника" visible={isModalVisible} onOk={() => {}} onCancel={handleCancel}>
                <InputMask
                    mask="+7 (999) 999-99-99"
                    value={newPhoneNumber}
                    onChange={e => setNewPhoneNumber(e.target.value)}
                    placeholder="Введите номер телефона"
                    beforeMaskedValueChange={(newState, oldState, userInput) => {
                        let { value } = newState;
                        if (value.match(/\d/g) && value.match(/\d/g).length > 11) {
                            return oldState;
                        }
                        return newState;
                    }}
                />
            </Modal>
        </StyledContainer>
    );
};

export default FamilyDetails;

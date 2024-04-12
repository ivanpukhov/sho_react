import React, { useEffect, useState } from 'react';
import { Button, Input, List, message, Modal, Space, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import InputMask from 'react-input-mask';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledList = styled(List)`
  max-width: 600px;
  margin: 10px auto;
  border-radius: 8px;
`;

const StyledItem = styled(List.Item)`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  &:hover {
    background: #e6f7ff;
  }
`;

const StyledModal = styled(Modal)`
  @media (max-width: 768px) {
    width: 95% !important;
  }
`;

const StyledButton = styled(Button)`
  margin: 0 10px;
  border-radius: 4px;
`;

const FamilyHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const FamiliesList = () => {
    const [families, setFamilies] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [phoneNumbers, setPhoneNumbers] = useState([{ number: '', valid: false }]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            const { data } = await axios.get('https://lll.ix-web.site/api/families/myFamily', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFamilies(data);
        } catch (error) {
            console.error('Ошибка при загрузке списка семей', error);
            message.error('Ошибка при загрузке списка семей');
        }
    };

    const showModal = () => setIsModalVisible(true);

    const handleOk = async () => {
        const validPhoneNumbers = phoneNumbers
            .filter(pn => pn.valid)
            .map(pn => pn.number.replace(/\D+/g, ''));

        if (validPhoneNumbers.length > 0 && familyName) {
            try {
                await axios.post('https://lll.ix-web.site/api/families', {
                    name: familyName,
                    phoneNumbers: validPhoneNumbers,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                swal("Успех", "Семья успешно создана.", "success");
                setIsModalVisible(false);
                setFamilyName('');
                setPhoneNumbers([{ number: '', valid: false }]);
                fetchFamilies();
            } catch (error) {
                swal("Ошибка", "Не удалось создать семью.", "error");
            }
        } else {
            swal("Внимание", "Пожалуйста, введите корректные данные.", "warning");
        }
    };

    const handleCancel = () => setIsModalVisible(false);

    const handleAddPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, { number: '', valid: false }]);
    };

    const handlePhoneNumberChange = (index, event) => {
        const newPhoneNumbers = [...phoneNumbers];
        newPhoneNumbers[index].number = event.target.value;
        setPhoneNumbers(newPhoneNumbers);
        if (event.target.value.replace(/\D+/g, '').length === 11) {
            checkPhoneNumber(index, event.target.value);
        }
    };

    const handleRemovePhoneNumber = (index) => {
        const newPhoneNumbers = [...phoneNumbers].filter((_, idx) => idx !== index);
        setPhoneNumbers(newPhoneNumbers);
    };

    const checkPhoneNumber = async (index, phoneNumber) => {
        try {
            const formattedPhoneNumber = phoneNumber.replace(/\D+/g, '');
            const response = await axios.post('https://lll.ix-web.site/api/users/checkPhoneNumber', { phoneNumber: formattedPhoneNumber });
            const newPhoneNumbers = [...phoneNumbers];
            newPhoneNumbers[index].valid = response.data.exists;
            setPhoneNumbers(newPhoneNumbers);
            if (!response.data.exists) {
                message.error('Номер телефона не зарегистрирован');
            }
        } catch (error) {
            message.error('Ошибка при проверке номера телефона');
        }
    };

    return (
        <>
            <StyledList
                header={<FamilyHeader>Мои семьи</FamilyHeader>}
                bordered
                dataSource={families}
                renderItem={family => (
                    <StyledItem key={family.id} onClick={() => navigate(`/family/${family.id}`)}>
                        Семья {family.name}
                    </StyledItem>
                )}
            />
            <StyledButton type="primary" onClick={showModal}>
                Создать новую семью
            </StyledButton>
            <StyledModal title="Создать новую семью" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="Название семьи" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                {phoneNumbers.map((item, index) => (
                    <Space key={index} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                        <InputMask mask="+7 (999) 999-99-99" value={item.number}
                                   onChange={(e) => handlePhoneNumberChange(index, e)}>
                            {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                        {(phoneNumbers.length > 1 || item.number) && (
                            <Tooltip title="Удалить номер">
                                <StyledButton shape="circle" icon={<CloseCircleOutlined />}
                                              onClick={() => handleRemovePhoneNumber(index)} />
                            </Tooltip>
                        )}
                    </Space>
                ))}
                <StyledButton onClick={handleAddPhoneNumber} style={{ marginTop: 10 }}>Добавить ещё номер</StyledButton>
            </StyledModal>
        </>
    );
};

export default FamiliesList;

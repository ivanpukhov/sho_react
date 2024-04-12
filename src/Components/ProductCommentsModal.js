import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List, message, Card, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProductCommentsModal = ({ isVisible, onClose, productId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        if (productId) {
            fetchComments();
        }
    }, [productId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://192.168.92.34:3000/api/comments/product/${productId}`);
            setComments(response.data);
        } catch (error) {
            message.error('Не удалось загрузить комментарии');
        }
    };

    const handleAddComment = async () => {
        try {
            await axios.post('http://192.168.92.34:3000/api/comments', {
                text: newComment,
                productId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNewComment('');
            fetchComments();
            message.success('Комментарий добавлен');
        } catch (error) {
            message.error('Не удалось добавить комментарий');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://192.168.92.34:3000/api/comments/${commentId}`);
            fetchComments();
            message.success('Комментарий удален');
        } catch (error) {
            message.error('Не удалось удалить комментарий');
        }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await axios.put(`http://192.168.92.34:3000/api/comments/${commentId}`, { text: editingText });
            setEditingCommentId(null);
            setEditingText('');
            fetchComments();
            message.success('Комментарий обновлен');
        } catch (error) {
            message.error('Не удалось обновить комментарий');
        }
    };

    return (
        <Modal
            title="Комментарии к товару"
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Input
                    key="new-comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Добавьте комментарий"
                    onPressEnter={handleAddComment}
                />,
                <Button key="submit" type="primary" onClick={handleAddComment}>
                    Добавить
                </Button>
            ]}
        >
            <List
                dataSource={comments}
                renderItem={comment => (
                    <Card
                        key={comment.id}
                        actions={[
                            userId === comment.userId && <Tooltip title="Редактировать"><EditOutlined onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.text); }} /></Tooltip>,
                            userId === comment.userId && <Tooltip title="Удалить"><DeleteOutlined onClick={() => handleDeleteComment(comment.id)} /></Tooltip>
                        ]}
                        title={comment.User.name}
                    >
                        {editingCommentId === comment.id ? (
                            <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onPressEnter={() => handleUpdateComment(comment.id)}
                            />
                        ) : (
                            <p>{comment.text}</p>
                        )}
                    </Card>
                )}
            />
        </Modal>
    );
};

export default ProductCommentsModal;

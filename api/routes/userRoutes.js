const userController = require('../controllers/userController')

module.exports = [
    {
        method: 'GET',
        url: '/users',
        handler: userController.getAllUsers,
    },
    {
        method: 'POST',
        url: '/users',
        handler: userController.createUser,
    },
    {
        method: 'GET',
        url: '/users/:id',
        handler: userController.getUserById,
    },
    {
        method: 'PUT',
        url: '/users/:id',
        handler: userController.updateUser,
    },
    {
        method: 'DELETE',
        url: '/users/:id',
        handler: userController.deleteUser,
    },
    {
        method: 'GET',
        url: '/users/:id/friends',
        handler: userController.getUserFriends,
    },
]

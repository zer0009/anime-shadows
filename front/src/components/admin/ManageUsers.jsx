import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { Search, Edit } from '@mui/icons-material';
import { fetchUsers, updateUserRole } from '../../api/modules/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      console.log(users);
      setUsers(users);
    };
    loadUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div>
      <Typography variant="h6">Manage Users</Typography>
      <TextField
        label="Search Users"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <IconButton>
              <Search />
            </IconButton>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="moderator">Moderator</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRoleChange(user._id, user.role)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageUsers;
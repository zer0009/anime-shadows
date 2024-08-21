import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Search, Edit, Save, Cancel } from '@mui/icons-material';
import { fetchUsers, updateUserRole } from '../../api/modules/admin';
import styles from './ManageUsers.module.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await fetchUsers();
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (error) {
      console.error('Error loading users:', error);
      showSnackbar('Failed to load users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user, newRole: user.role });
  };

  const handleRoleChange = (newRole) => {
    setEditingUser({ ...editingUser, newRole });
  };

  const handleSaveClick = async () => {
    try {
      await updateUserRole(editingUser._id, editingUser.newRole);
      setUsers(users.map(user => user._id === editingUser._id ? { ...user, role: editingUser.newRole } : user));
      setEditingUser(null);
      showSnackbar('User role updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user role:', error);
      showSnackbar('Failed to update user role', 'error');
    }
  };

  const handleCancelClick = () => {
    setEditingUser(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper className={styles.manageUsers}>
      <Typography variant="h6" className={styles.title}>Manage Users</Typography>
      <TextField
        label="Search Users"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <IconButton>
              <Search />
            </IconButton>
          ),
        }}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" m={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UserName</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingUser && editingUser._id === user._id ? (
                      <Select
                        value={editingUser.newRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="moderator">Moderator</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    ) : (
                      user.role || 'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser && editingUser._id === user._id ? (
                      <>
                        <IconButton onClick={handleSaveClick} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton onClick={handleCancelClick} color="secondary">
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton onClick={() => handleEditClick(user)}>
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ManageUsers;
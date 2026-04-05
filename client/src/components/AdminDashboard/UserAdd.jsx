import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Trash2, Edit2, Search} from "lucide-react";

const API_BASE = "http://localhost:4001/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", roleId: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        axios.get(`${API_BASE}/getalluser`),
        axios.get(`${API_BASE}/roles`)
      ]);
      if (uRes.data.success) setUsers(uRes.data.users);
      if (rRes.data.success) setRoles(rRes.data.roles);
    } catch (err) { console.error("Fetch error", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `${API_BASE}/updateuser/${editingId}` : `${API_BASE}/register`;
      const res = await axios[editingId ? 'put' : 'post'](url, form);
      
      if (res.data.success) {
        if (editingId) {
          setUsers(users.map(u => u.id === editingId ? res.data.user : u));
          setEditingId(null);
        } else {
          setUsers([res.data.user, ...users]);
        }
        setForm({ username: "", email: "", password: "", roleId: "" });
        setStatus({ type: "success", msg: `User ${editingId ? 'updated' : 'registered'}!` });
      }
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Action failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/deleteuser/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ username: user.username, email: user.email, roleId: user.roleId || "", password: "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredUsers = users.filter(u => 
    u?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Form Section */}
      <section className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          {editingId ? <Edit2 size={20}/> : <UserPlus size={20} />}
          <h2 className="font-bold">{editingId ? "Edit User" : "Register User"}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border p-2 rounded-lg text-sm" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input className="border p-2 rounded-lg text-sm" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input className="border p-2 rounded-lg text-sm" type="password" placeholder={editingId ? "New Password (optional)" : "Password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingId} />
          <select className="border p-2 rounded-lg text-sm bg-white" value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} required>
            <option value="">Select Role</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.roleName}</option>)}
          </select>
          <div className="md:col-span-4 flex justify-between items-center mt-2">
            <span className={`text-xs ${status.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{status.msg}</span>
            <div className="flex gap-2">
              {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({username:"", email:"", password:"", roleId:""})}} className="px-4 py-2 text-sm bg-gray-100 rounded-lg">Cancel</button>}
              <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                {loading ? "..." : editingId ? "Update" : "Register"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-700">Accounts ({users.length})</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
            <input className="pl-8 pr-3 py-1.5 border rounded-md text-xs w-48 focus:w-64 transition-all outline-none" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-3 font-medium">User</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="p-3">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-bold">
                    {user.Role?.roleName || "User"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  <button onClick={() => startEdit(user)} className="p-1.5 text-gray-500 hover:text-indigo-600"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
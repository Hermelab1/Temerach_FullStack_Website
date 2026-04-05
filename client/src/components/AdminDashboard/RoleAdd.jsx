import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
   Shield, Edit3, Lock, Unlock, Save
} from "lucide-react";

const API_BASE = "http://localhost:4001/api/roles";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ roleName: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [selectedRole, setSelectedRole] = useState(null);
  const [allPermissions, setAllPermissions] = useState({});
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissionLoading, setPermissionLoading] = useState(false);

  // ✅ FETCH ROLES
  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data.success) setRoles(res.data.roles);
    } catch (err) { 
      showStatus("error", "Could not load roles"); 
    }
  }, []);

  // ✅ FETCH ALL PERMISSIONS
  const fetchAllPermissions = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/permissions/list`);
      if (res.data.success) {
        const grouped = res.data.permissions.reduce((acc, perm) => {
          const moduleName = perm.module?.moduleName || 'Other';
          if (!acc[moduleName]) acc[moduleName] = { module: perm.module, permissions: [] };
          acc[moduleName].permissions.push(perm);
          return acc;
        }, {});
        setAllPermissions(grouped);
      }
    } catch (err) { 
      console.error("Error:", err); 
    }
  }, []);

  // ✅ FETCH ROLE PERMISSIONS
  const fetchRolePermissions = useCallback(async (roleId) => {
    setPermissionLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${roleId}/permissions`);
      const ids = res.data.permissions 
        ? res.data.permissions.map(p => p.PermissionId) 
        : [];
      setRolePermissions(ids);
    } catch (err) { 
      showStatus("error", "Failed to load permissions"); 
    } finally { 
      setPermissionLoading(false); 
    }
  }, []);

  // ✅ LOAD DATA ON MOUNT
  useEffect(() => {
    fetchRoles();
    fetchAllPermissions();
  }, [fetchRoles, fetchAllPermissions]);

  // ✅ LOAD ROLE PERMISSIONS
  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.id);
    }
  }, [selectedRole, fetchRolePermissions]);

  // ✅ STATUS MESSAGE
  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
  };

  // ✅ SUBMIT ROLE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = editingId 
        ? await axios.put(`${API_BASE}/${editingId}`, form)
        : await axios.post(API_BASE, form);
      
      if (res.data.success) {
        fetchRoles();
        setForm({ roleName: "", description: "" });
        setEditingId(null);
        showStatus("success", editingId ? "Role updated" : "Role created");
      }
    } catch (err) { 
      showStatus("error", "Submit failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  // ✅ SAVE PERMISSIONS
  const handleSavePermissions = async () => {
    setPermissionLoading(true);
    try {
      await axios.post(`${API_BASE}/${selectedRole.id}/permissions`, {
        permissionIds: rolePermissions
      });
      showStatus("success", "Permissions updated");
    } catch (err) { 
      showStatus("error", "Update failed"); 
    } finally { 
      setPermissionLoading(false); 
    }
  };

  // ✅ TOGGLE PERMISSION
  const togglePermission = (id) => {
    setRolePermissions(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="text-blue-600" /> Access Control
          </h1>
          <input 
            type="text" 
            placeholder="Search roles..." 
            className="p-2 border rounded-lg" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </header>

        {status.msg && (
          <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 text-white ${
            status.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {status.msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Role" : "New Role"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full p-3 border rounded-xl" 
                placeholder="Role Name" 
                value={form.roleName}
                onChange={e => setForm({...form, roleName: e.target.value})} 
                required 
              />

              <textarea 
                className="w-full p-3 border rounded-xl" 
                placeholder="Description" 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} 
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                {loading ? "Saving..." : "Save Role"}
              </button>
            </form>
          </div>

          {/* ROLE LIST */}
          <div className="lg:col-span-2 space-y-4">
            {roles
              .filter(r => r.roleName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(role => (
              <div key={role.id} className="bg-white p-5 rounded-2xl border shadow-sm">

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{role.roleName}</h3>
                    <p className="text-gray-500 text-sm">{role.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                    >
                      {selectedRole?.id === role.id ? <Unlock size={20}/> : <Lock size={20}/>}
                    </button>

                    <button 
                      onClick={() => {
                        setEditingId(role.id);
                        setForm({roleName: role.roleName, description: role.description});
                      }} 
                      className="p-2 text-amber-600"
                    >
                      <Edit3 size={20}/>
                    </button>
                  </div>
                </div>

                {/* PERMISSIONS */}
                {selectedRole?.id === role.id && (
                  <div className="mt-6 pt-6 border-t">

                    <div className="flex justify-between mb-4">
                      <span className="font-bold">Module Permissions</span>

                      <button 
                        onClick={handleSavePermissions} 
                        className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Save size={14}/> Save
                      </button>
                    </div>

                    {/* ✅ FIXED: USING permissionLoading */}
                    {permissionLoading ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading permissions...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(allPermissions).map(([name, group]) => (
                          <div key={name} className="border rounded-lg overflow-hidden">

                            <div className="bg-gray-50 p-2 font-medium text-sm">
                              {name}
                            </div>

                            <div className="p-2 grid grid-cols-2 gap-2">
                              {group.permissions.map(p => (
                                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={rolePermissions.includes(p.id)}
                                    onChange={() => togglePermission(p.id)}
                                  />
                                  {p.action?.action}
                                </label>
                              ))}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
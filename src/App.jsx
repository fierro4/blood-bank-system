import React, { useState, useEffect } from 'react';
import { Heart, Users, Droplet, Package, FileText, Activity, Trash2, Plus, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const BloodBankUI = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [donations, setDonations] = useState([]);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${API_URL}/donors`);
      const data = await res.json();
      setDonors(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const res = await fetch(`${API_URL}/recipients`);
      const data = await res.json();
      setRecipients(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBloodStock = async () => {
    try {
      const res = await fetch(`${API_URL}/blood-stock`);
      const data = await res.json();
      setBloodStock(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await fetch(`${API_URL}/donations`);
      const data = await res.json();
      setDonations(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API_URL}/issues`);
      const data = await res.json();
      setIssues(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchRecipients();
    fetchBloodStock();
    fetchDonations();
    fetchIssues();
    fetchStats();
  }, []);

  const handleAddDonor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          contact: formData.contact,
          address: formData.address
        })
      });
      if (res.ok) {
        await fetchDonors();
        closeModal();
        alert('Donor added successfully!');
      }
    } catch (error) {
      alert('Failed to add donor');
    }
    setLoading(false);
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`${API_URL}/donors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchDonors();
        alert('Deleted!');
      }
    } catch (error) {
      alert('Failed');
    }
  };

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/recipients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          bloodGroup: formData.bloodGroup,
          hospital: formData.hospital,
          contact: formData.contact
        })
      });
      if (res.ok) {
        await fetchRecipients();
        closeModal();
        alert('Recipient added!');
      }
    } catch (error) {
      alert('Failed');
    }
    setLoading(false);
  };

  const handleDeleteRecipient = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      const res = await fetch(`${API_URL}/recipients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchRecipients();
        alert('Deleted!');
      }
    } catch (error) {
      alert('Failed');
    }
  };

  const handleRecordDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: formData.donorId,
          quantity: formData.quantity,
          date: formData.date || new Date().toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        await fetchDonations();
        await fetchBloodStock();
        await fetchStats();
        closeModal();
        alert('Donation recorded!');
      }
    } catch (error) {
      alert('Failed');
    }
    setLoading(false);
  };

  const handleIssueBlood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: formData.recipientId,
          quantity: formData.quantity,
          staffId: 1
        })
      });
      if (res.ok) {
        await fetchIssues();
        await fetchBloodStock();
        await fetchStats();
        closeModal();
        alert('Blood issued!');
      }
    } catch (error) {
      alert('Failed');
    }
    setLoading(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: 'white',
    color: 'black',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500'
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bb-header shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplet className="w-10 h-10 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Blood Bank Management System</h1>
                <p className="text-red-100 text-sm subtitle">Saving Lives</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">Logged in as</p>
              <p className="font-semibold">Admin</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'donors', label: 'Donors', icon: Users },
              { id: 'recipients', label: 'Recipients', icon: Heart },
              { id: 'stock', label: 'Stock', icon: Package },
              { id: 'donations', label: 'Donations', icon: Droplet },
              { id: 'issues', label: 'Issues', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 font-medium ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="stat-card stat-donors">
                <p className="text-sm">Total Donors</p>
                <p className="text-3xl font-bold mt-2">{stats.totalDonors || 0}</p>
              </div>
              <div className="stat-card stat-recipients">
                <p className="text-sm">Recipients</p>
                <p className="text-3xl font-bold mt-2">{stats.totalRecipients || 0}</p>
              </div>
              <div className="stat-card stat-units">
                <p className="text-sm">Total Units</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUnits || 0}</p>
              </div>
              <div className="stat-card stat-donations">
                <p className="text-sm">Donations (30d)</p>
                <p className="text-3xl font-bold mt-2">{stats.recentDonations || 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Blood Stock</h3>
              <div className="space-y-3">
                {bloodStock.map(stock => (
                  <div key={stock.Blood_Group} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-red-600">{stock.Blood_Group}</span>
                      </div>
                      <p className="font-medium">{stock.Quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search donors..."
                className="px-4 py-2 border rounded-lg w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => openModal('addDonor')} className="bb-btn-accent px-4 py-2 rounded-lg flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Donor
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donors.filter(d => d.Name.toLowerCase().includes(searchTerm.toLowerCase())).map(donor => (
                    <tr key={donor.Donor_ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{donor.Name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">{donor.Blood_Group}</span>
                      </td>
                      <td className="px-6 py-4">{donor.Contact}</td>
                      <td className="px-6 py-4">{donor.Address}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteDonor(donor.Donor_ID)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recipients' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => openModal('addRecipient')} className="bb-btn-primary px-4 py-2 rounded-lg flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Recipient
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recipients.map(r => (
                    <tr key={r.Recipient_ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{r.Name}</td>
                      <td className="px-6 py-4">{r.Age}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{r.Blood_Group}</span>
                      </td>
                      <td className="px-6 py-4">{r.Hospital}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteRecipient(r.Recipient_ID)} className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-4">
            <button onClick={() => openModal('recordDonation')} className="bb-btn-primary px-4 py-2 rounded-lg flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Record Donation
            </button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodGroups.map(bg => {
                const stock = bloodStock.find(s => s.Blood_Group === bg);
                const qty = stock ? stock.Quantity : 0;
                return (
                  <div key={bg} className={`bg-white rounded-lg shadow p-6 border-2 ${qty < 5 ? 'border-red-500' : 'border-transparent'}`}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">{bg}</h3>
                      <p className="text-3xl font-bold text-red-600 mt-2">{qty}</p>
                      <p className="text-sm text-gray-500">units</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-4">
            <button onClick={() => openModal('recordDonation')} className="bb-btn-primary px-4 py-2 rounded-lg flex items-center">
              <Plus className="w-5 h-5 inline mr-2" />
              New Donation
            </button>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map(d => (
                    <tr key={d.Donation_ID}>
                      <td className="px-6 py-4">{new Date(d.Donation_Date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{d.Donor_Name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">{d.Blood_Group}</span>
                      </td>
                      <td className="px-6 py-4">{d.Quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-4">
            <button onClick={() => openModal('issueBlood')} className="bb-btn-accent px-4 py-2 rounded-lg flex items-center">
              <Plus className="w-5 h-5 inline mr-2" />
              Issue Blood
            </button>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {issues.map(i => (
                    <tr key={i.Issue_ID}>
                      <td className="px-6 py-4">{new Date(i.Issue_Date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{i.Recipient_Name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{i.Blood_Group}</span>
                      </td>
                      <td className="px-6 py-4">{i.Quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }} onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#111' }}>
                {modalType === 'addDonor' && 'Add Donor'}
                {modalType === 'addRecipient' && 'Add Recipient'}
                {modalType === 'recordDonation' && 'Record Donation'}
                {modalType === 'issueBlood' && 'Issue Blood'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {modalType === 'addDonor' && (
              <form onSubmit={handleAddDonor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="name" placeholder="Full Name" style={inputStyle} onChange={handleInputChange} value={formData.name || ''} autoComplete="off" required />
                <input type="date" name="dob" style={inputStyle} onChange={handleInputChange} value={formData.dob || ''} required />
                <select name="gender" style={inputStyle} onChange={handleInputChange} value={formData.gender || ''} required>
                  <option value="" disabled>Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                <select name="bloodGroup" style={inputStyle} onChange={handleInputChange} value={formData.bloodGroup || ''} required>
                  <option value="" disabled>Select Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <input type="tel" name="contact" placeholder="Contact" style={inputStyle} onChange={handleInputChange} value={formData.contact || ''} autoComplete="off" required />
                <textarea name="address" placeholder="Address" style={inputStyle} rows={2} onChange={handleInputChange} value={formData.address || ''} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={closeModal} style={{...buttonStyle, flex: 1, backgroundColor: '#e5e7eb', color: '#111'}}>Cancel</button>
                  <button type="submit" className="bb-btn-accent" style={{...buttonStyle, flex: 1}} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'addRecipient' && (
              <form onSubmit={handleAddRecipient} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="name" placeholder="Full Name" style={inputStyle} onChange={handleInputChange} value={formData.name || ''} autoComplete="off" required />
                <input type="number" name="age" placeholder="Age" style={inputStyle} onChange={handleInputChange} value={formData.age || ''} required min="1" />
                <select name="bloodGroup" style={inputStyle} onChange={handleInputChange} value={formData.bloodGroup || ''} required>
                  <option value="" disabled>Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <input type="text" name="hospital" placeholder="Hospital" style={inputStyle} onChange={handleInputChange} value={formData.hospital || ''} autoComplete="off" required />
                <input type="tel" name="contact" placeholder="Contact" style={inputStyle} onChange={handleInputChange} value={formData.contact || ''} autoComplete="off" required />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={closeModal} style={{...buttonStyle, flex: 1, backgroundColor: '#e5e7eb', color: '#111'}}>Cancel</button>
                  <button type="submit" className="bb-btn-primary" style={{...buttonStyle, flex: 1}} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'recordDonation' && (
              <form onSubmit={handleRecordDonation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select name="donorId" style={inputStyle} onChange={handleInputChange} value={formData.donorId || ''} required>
                  <option value="" disabled>Select Donor</option>
                  {donors.map(d => <option key={d.Donor_ID} value={d.Donor_ID}>{d.Name} ({d.Blood_Group})</option>)}
                </select>
                <input type="number" name="quantity" placeholder="Quantity (units)" style={inputStyle} onChange={handleInputChange} value={formData.quantity || ''} min="1" required />
                <input type="date" name="date" style={inputStyle} onChange={handleInputChange} value={formData.date || new Date().toISOString().split('T')[0]} required />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={closeModal} style={{...buttonStyle, flex: 1, backgroundColor: '#e5e7eb', color: '#111'}}>Cancel</button>
                  <button type="submit" className="bb-btn-primary" style={{...buttonStyle, flex: 1}} disabled={loading}>
                    {loading ? 'Recording...' : 'Record'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'issueBlood' && (
              <form onSubmit={handleIssueBlood} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select name="recipientId" style={inputStyle} onChange={handleInputChange} value={formData.recipientId || ''} required>
                  <option value="" disabled>Select Recipient</option>
                  {recipients.map(r => <option key={r.Recipient_ID} value={r.Recipient_ID}>{r.Name} ({r.Blood_Group})</option>)}
                </select>
                <input type="number" name="quantity" placeholder="Quantity (units)" style={inputStyle} onChange={handleInputChange} value={formData.quantity || ''} min="1" required />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={closeModal} style={{...buttonStyle, flex: 1, backgroundColor: '#e5e7eb', color: '#111'}}>Cancel</button>
                  <button type="submit" className="bb-btn-accent" style={{...buttonStyle, flex: 1}} disabled={loading}>
                    {loading ? 'Issuing...' : 'Issue'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white mt-12 py-6 text-center">
        <p className="text-sm">© 2025 Blood Bank Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BloodBankUI;
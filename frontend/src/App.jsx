import React, { useEffect, useState } from "react";
import { fetchStates, fetchCommissions, fetchCommissionAddress, searchCases } from "./services/api";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import StatsCard from "./components/StatsCard";
import { Search, FileText, Users, MapPin, Phone, Mail, Globe, Building2, Calendar, UserCheck } from "lucide-react";

function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [commissions, setCommissions] = useState([]);
  const [selectedCommission, setSelectedCommission] = useState("");
  const [commissionAddress, setCommissionAddress] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [isLoadingCommissions, setIsLoadingCommissions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  useEffect(() => {
    setIsLoadingStates(true);
    fetchStates()
      .then(data => setStates(data.data || []))
      .finally(() => setIsLoadingStates(false));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setIsLoadingCommissions(true);
      setCommissions([]);
      fetchCommissions(selectedState)
        .then(data => setCommissions(data.data || []))
        .finally(() => setIsLoadingCommissions(false));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCommission) {
      fetchCommissionAddress(selectedCommission).then(data => setCommissionAddress(data.data || null));
    }
  }, [selectedCommission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCommission) {
      alert('Please select a commission first');
      return;
    }
    
    if (!fromDate || !toDate) {
      alert('Please select both from and to dates');
      return;
    }
    
    if (!caseNumber || caseNumber.trim() === '') {
      alert('Please enter a case number');
      return;
    }
    
    const payload = {
      commissionId: parseInt(selectedCommission),
      dateRequestType: 1,
      fromDate,
      toDate,
      judgeId: "",
      orderType: 1,
      serchType: 4,
      serchTypeValue: caseNumber.trim()
    };
    
    console.log('Submitting search with payload:', payload);
    
    try {
      setIsSearching(true);
      console.log('Making API call...');
      
      const resp = await searchCases(payload);
      console.log('Search response received:', resp);
      
      if (resp && resp.data) {
        const list = Array.isArray(resp.data) ? resp.data : [];
        console.log('Setting results with:', list);
        setResults(list);
        console.log('Results state updated successfully');
      } else {
        console.log('No data in response, setting empty results');
        setResults([]);
      }
      
      console.log('Search completed successfully');
    } catch (err) {
      console.error("Search failed with error:", err);
      alert(`Search failed: ${err.message || 'Unknown error occurred'}`);
      setResults([]);
    } finally {
      console.log('Setting isSearching to false');
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="badge badge-info">Pending</span>;
    if (status.toLowerCase().includes('closed')) return <span className="badge badge-success">Closed</span>;
    if (status.toLowerCase().includes('pending')) return <span className="badge badge-warning">Pending</span>;
    return <span className="badge badge-info">{status}</span>;
  };

  const getStatusCounts = () => {
    const pendingCount = results.filter(r => r.caseStageName && r.caseStageName.toLowerCase().includes('pending')).length;
    const closedCount = results.filter(r => r.caseStageName && r.caseStageName.toLowerCase().includes('closed')).length;
    
    const counts = {
      total: results.length,
      pending: pendingCount,
      closed: closedCount,
      active: results.length - pendingCount - closedCount
    };
    return counts;
  };



  return (
    <div className="min-h-screen" style={{backgroundColor: '#eff6ff'}}>
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">LEXI Assessment Portal</h1>
            </div>
            <div className="text-sm text-gray-500">
              Legal Case Management System
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* State Selection */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select State</h2>
            </div>
            {isLoadingStates ? (
              <LoadingSpinner size="sm" text="Loading states..." />
            ) : (
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="select-field"
              >
                <option value="">-- Choose State --</option>
                {states.map(state => (
                  <option key={state.commissionId} value={state.commissionId}>
                    {state.commissionNameEn}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Commission Selection */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select Commission</h2>
            </div>
            {isLoadingCommissions && selectedState ? (
              <LoadingSpinner size="sm" text="Loading commissions..." />
            ) : (
              <select
                value={selectedCommission}
                onChange={e => setSelectedCommission(e.target.value)}
                className="select-field"
                disabled={!selectedState || commissions.length === 0}
              >
                <option value="">-- Choose Commission --</option>
                {commissions.map(c => (
                  <option key={c.commissionId} value={c.commissionId}>
                    {c.commissionNameEn}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Search Form */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Search Cases</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
                <select
                  value={searchBy}
                  onChange={e => setSearchBy(e.target.value)}
                  className="select-field"
                >
                  <option value="">-- Choose field --</option>
                  <option value="case-number">Case Number</option>
                  <option value="complainant">Complainant</option>
                  <option value="respondent">Respondent</option>
                  <option value="complainant-advocate">Complainant Advocate</option>
                  <option value="respondent-advocate">Respondent Advocate</option>
                  <option value="industry-type">Industry Type</option>
                  <option value="judge">Judge</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Number</label>
                <input
                  type="text"
                  placeholder="Enter case number"
                  value={caseNumber}
                  onChange={e => setCaseNumber(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button type="submit" className="btn-primary" disabled={isSearching}>
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" text="" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Search Cases</span>
                  </div>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setSearchBy("");
                  setCaseNumber("");
                  setResults([]);
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Stats Cards */}
        {results.length > 0 && (() => {
          try {
            const counts = getStatusCounts();
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Cases"
                  value={counts.total}
                  icon={FileText}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                />
                <StatsCard
                  title="Active Cases"
                  value={counts.active}
                  icon={UserCheck}
                  className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                />
                <StatsCard
                  title="Pending Cases"
                  value={counts.pending}
                  icon={Calendar}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
                />
                <StatsCard
                  title="Closed Cases"
                  value={counts.closed}
                  icon={Users}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                />
              </div>
            );
          } catch (error) {
            console.error('Error rendering stats cards:', error);
            return <div className="text-red-500">Error loading statistics</div>;
          }
        })()}

        {/* Results Table */}
        {results.length > 0 ? (() => {
          try {
            return (
              <div className="card mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                      {results.length} case{results.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="table-header">
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Filing Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Case Number</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Complainant</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Complainant Advocate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Respondent</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Respondent Advocate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((r, idx) => (
                        <tr key={idx} className="table-row">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.caseFilingDate || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              try {
                                return getStatusBadge(r.caseStageName);
                              } catch (error) {
                                console.error('Error rendering status badge:', error);
                                return <span className="badge badge-info">Error</span>;
                              }
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{r.caseNumber || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.complainantName || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.complainantAdvocateName || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.respondentName || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.respondentAdvocateName || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          } catch (error) {
            console.error('Error rendering results table:', error);
            return <div className="text-red-500">Error loading results table</div>;
          }
        })() : results.length === 0 && !isSearching && (fromDate || toDate || caseNumber) ? (
          <div className="card mb-8">
            <EmptyState
              title="No cases found"
              description="No cases match your current search criteria. Try adjusting your search parameters or date range."
              icon={FileText}
              action={
                <button 
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setSearchBy("");
                    setCaseNumber("");
                  }}
                  className="btn-primary"
                >
                  Reset Search
                </button>
              }
            />
          </div>
        ) : null}

        {/* Commission Address */}
        {(() => {
          const addressArray = Array.isArray(commissionAddress)
            ? commissionAddress
            : (commissionAddress && Array.isArray(commissionAddress.data) ? commissionAddress.data : []);
          const addr = addressArray && addressArray.length > 0 ? addressArray[0] : null;
          
          if (!addr) return null;
          
          return (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Commission Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="text-base font-semibold text-gray-900">{addr.state_name_en || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Commission</p>
                      <p className="text-base font-semibold text-gray-900">{addr.commission_name_en || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base font-semibold text-gray-900">{addr.commission_type_en || "-"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base text-gray-900">{addr.full_address || "-"}</p>
                      <p className="text-sm text-gray-600 mt-1">PIN: {addr.postal_pin_code || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-900">{addr.phone_number || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-900">{addr.email_id || "-"}</p>
                    </div>
                  </div>
                  
                  {addr.web_site_address && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <a href={addr.web_site_address} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                          {addr.web_site_address}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}

export default App;

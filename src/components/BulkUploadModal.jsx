import React from 'react';
import { UploadCloud, Download, X } from 'lucide-react';

export default function BulkUploadModal({ isOpen, onClose, role }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>Bulk Upload {role}s</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Upload a CSV file containing the new {role.toLowerCase()} data.
        </p>

        <button className="btn btn-outline w-full mb-6" style={{ justifyContent: 'center' }}>
          <Download size={16} /> Download {role} CSV Template
        </button>

        <div style={{
          border: '2px dashed #E5E7EB', borderRadius: '0.5rem', padding: '2rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          backgroundColor: '#F9FAFB', cursor: 'pointer'
        }}>
          <UploadCloud size={40} color="#818CF8" />
          <p style={{ fontWeight: 500 }}>Drag and drop your CSV here</p>
          <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>or click to browse from your computer</p>
        </div>

        <div className="flex justify-between mt-6">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">Upload File</button>
        </div>
      </div>
    </div>
  );
}

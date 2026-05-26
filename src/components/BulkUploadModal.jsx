import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { UploadCloud, Download, X, Loader2 } from 'lucide-react';
import { baseUrl } from './utils/api';

export default function BulkUploadModal({ isOpen, onClose, role, token, onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('roleFilter', role);

        try {
            const res = await fetch(`${baseUrl}/api/users/bulk`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || 'Upload failed');
            }
            if (onUploadSuccess) onUploadSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                handleFileChange({ target: { files: [file] } });
            }
        }
    };

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                padding: '20px',
            }}
        >
            <div
                className="animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh',
                }}
            >
                {/* Premium Header */}
                <div
                    style={{
                        padding: '40px 40px 30px 40px',
                        flexShrink: 0,
                        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '12px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')
                            }
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            style={{
                                padding: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                            }}
                        >
                            <UploadCloud size={32} />
                        </div>
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '1.75rem',
                                    fontWeight: 900,
                                    color: 'white',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Bulk Upload
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    style={{
                                        padding: '4px 10px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {role} Data
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div
                    style={{
                        overflowY: 'auto',
                        padding: '40px',
                        flex: 1,
                        backgroundColor: '#F8FAFC',
                    }}
                >
                    <button
                        style={{
                            width: '100%',
                            marginBottom: '24px',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '2px solid #E0F2FE',
                            backgroundColor: '#F0F9FF',
                            color: '#0284C7',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#E0F2FE')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#F0F9FF')}
                    >
                        <Download size={18} /> Download {role} CSV Template
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xlsx"
                        onChange={handleFileChange}
                    />
                    <div
                        style={{
                            border: '2px dashed #BAE6FD',
                            borderRadius: '24px',
                            padding: '40px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: uploading ? 0.5 : 1,
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onMouseOver={(e) => {
                            if (!uploading) {
                                e.currentTarget.style.borderColor = '#0EA5E9';
                                e.currentTarget.style.backgroundColor = '#F0F9FF';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!uploading) {
                                e.currentTarget.style.borderColor = '#BAE6FD';
                                e.currentTarget.style.backgroundColor = 'white';
                            }
                        }}
                    >
                        <div
                            style={{
                                padding: '16px',
                                backgroundColor: '#F0F9FF',
                                borderRadius: '50%',
                                color: '#0EA5E9',
                                marginBottom: '8px',
                            }}
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin" size={48} />
                            ) : (
                                <UploadCloud size={48} />
                            )}
                        </div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: '1.125rem',
                                fontWeight: 800,
                                color: '#1E293B',
                            }}
                        >
                            {uploading ? 'Processing File...' : 'Drag and drop your CSV here'}
                        </p>
                        <p
                            style={{
                                margin: 0,
                                color: '#94A3B8',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            or click to browse from your computer
                        </p>
                    </div>
                    <div style={{ marginBottom: '25px' }} />

                    <div className="flex gap-4 mt-8">
                        <button
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: '16px',
                                border: '2px solid #E2E8F0',
                                backgroundColor: 'transparent',
                                color: '#64748B',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#F1F5F9';
                                e.target.style.color = '#1E293B';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#64748B';
                            }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={uploading}
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                                color: 'white',
                                fontWeight: '800',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)',
                                transition: 'transform 0.2s',
                                opacity: uploading ? 0.7 : 1,
                            }}
                            onMouseOver={(e) => {
                                if (!uploading) e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                if (!uploading) e.target.style.transform = 'none';
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Users, Calendar } from 'lucide-react';
import api from '../utils/api/api';

const ScanUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'uploading'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  }

  interface Appointment {
    id: number;
    appointment_date: string;
    status: string;
  }

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await api.get('admin/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch appointments for the selected user
  useEffect(() => {
    if (!selectedUserId) {
      setAppointments([]);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoadingAppointments(true);
      try {
        const response = await api.get(`admin/appointments/`);
        // Filter appointments with status "finished"
        const finishedAppointments = response.data.filter(
          (appointment: Appointment) => appointment.status === 'finished'
        );
        setAppointments(finishedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [selectedUserId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('idle'); // Reset to idle when a new file is selected

      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string); // Set the preview URL
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        setPreviewUrl(null); // Clear the preview if the file is not an image
      }
    }
  };

  const SendScan = async () => {
    if (!selectedUserId) {
      alert('Please select a patient before uploading.');
      return;
    }

    if (!selectedAppointmentId) {
      alert('Please select an appointment before uploading.');
      return;
    }

    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('scan', selectedFile);
    formData.append('user', selectedUserId);
    formData.append('appointment', selectedAppointmentId);

    try {
      const response = await api.post('admin/history/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Medical record uploaded successfully:', response.data);
      setUploadStatus('success');
      alert('Medical record uploaded successfully to patient account.');
    } catch (error: any) {
      console.error('Error uploading medical record:', error);
      setUploadStatus('error');

      // Handle specific error messages from backend
      if (error.response?.data?.error) {
        alert(`Upload failed: ${error.response.data.error}`);
      } else {
        alert('Failed to upload the medical record. Please try again.');
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    setSelectedUserId('');
    setSelectedAppointmentId('');
    setAppointments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="scan-upload" className="py-16 bg-slate-100 border rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upload Medical Records for Patients
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            As an admin, upload medical scans and records directly to patient accounts.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Patient Selection */}
          <div className="mb-6">
            <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                id="patient-select"
                name="patient-select"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={isLoadingUsers}
              >
                <option value="" disabled>
                  {isLoadingUsers ? 'Loading patients...' : 'Select a patient'}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.username}) - {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Appointment Selection */}
          {selectedUserId && (
            <div className="mb-6">
              <label htmlFor="appointment-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Appointment
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="appointment-select"
                  name="appointment-select"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value)}
                  disabled={isLoadingAppointments}
                >
                  <option value="" disabled>
                    {isLoadingAppointments ? 'Loading appointments...' : 'Select an appointment'}
                  </option>
                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${uploadStatus === 'success' ? 'bg-green-50 border-green-300' : ''} ${
              uploadStatus === 'error' ? 'bg-red-50 border-red-300' : ''
            } ${uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-300' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setSelectedFile(file);
                setUploadStatus('idle');
                if (file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreviewUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setPreviewUrl(null);
                }
              }
            }}
          >
            <div className="space-y-1 text-center">
              {!selectedFile ? (
                <>
                  <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} strokeWidth={1.5} />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              ) : (
                <div className="py-4">
                  {uploadStatus === 'uploading' && (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-sm font-medium text-gray-900">Uploading medical record...</p>
                      <div className="mt-4 flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{selectedFile?.name}</span>
                      </div>
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="text-sm font-medium text-gray-900">Medical record uploaded successfully!</p>
                      <div className="mt-4 flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{selectedFile?.name}</span>
                      </div>
                    </div>
                  )}

                  {uploadStatus === 'error' && (
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                      <p className="text-sm font-medium text-gray-900">Upload failed. Please try again.</p>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="mt-4 max-w-xs mx-auto">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="rounded-lg shadow-md max-h-48 object-contain opacity-75"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-center items-center space-x-3">
            <button
              type="button"
              onClick={SendScan}
              disabled={!selectedUserId || !selectedAppointmentId || !selectedFile}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload to Patient Account
            </button>
            <button
              type="button"
              onClick={resetUpload}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanUpload;
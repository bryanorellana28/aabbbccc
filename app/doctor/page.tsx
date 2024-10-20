"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const response = await fetch('/api/appointments/unassigned');
    if (response.ok) {
      const data = await response.json();
      setAppointments(data);
    }
  };

  const fetchDoctors = async () => {
    const response = await fetch('/api/doctors');
    if (response.ok) {
      const data = await response.json();
      setDoctors(data);
    }
  };

  const assignDoctor = async (appointmentId, doctorId) => {
    const response = await fetch(`/api/appointments/${appointmentId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId }),
    });

    if (response.ok) {
      fetchAppointments();
      alert('Doctor assigned successfully');
    } else {
      alert('Failed to assign doctor');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="mb-4">Welcome, Dr. {session?.user?.name}!</p>

      <Card>
        <CardHeader>
          <CardTitle>Unassigned Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.map((appointment) => (
            <div key={appointment.id} className="mb-4 p-4 border rounded">
              <p>Date: {new Date(appointment.date).toLocaleString()}</p>
              <p>Patient: {appointment.user.name}</p>
              <Select onValueChange={(doctorId) => assignDoctor(appointment.id, doctorId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
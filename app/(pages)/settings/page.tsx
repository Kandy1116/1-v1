
'use client';

import React from 'react';
import { useUser } from '@/src/UserContext';

const SettingsPage = () => {
  const { user } = useUser();

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      {user ? (
        <div>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Subscription:</strong> Premium
          </p>
        </div>
      ) : (
        <p>You must be logged in to view this page.</p>
      )}
    </div>
  );
};

export default SettingsPage;

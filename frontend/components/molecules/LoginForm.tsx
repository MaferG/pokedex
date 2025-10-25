/**
 * LoginForm molecule component
 * @module components/molecules/LoginForm
 */

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { validateLoginForm } from '@/utils/validation';

export interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * Login form component with validation
 * @param {LoginFormProps} props - Login form properties
 * @returns {JSX.Element} Login form component
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateLoginForm(username, password);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={formErrors.username}
        placeholder="Enter your username"
        autoComplete="username"
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={formErrors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
};

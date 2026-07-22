'use client';

import {useActionState} from 'react';
import {type AdminLoginState, loginAdmin,} from '@/features/admin/admin.actions';

const initialState: AdminLoginState = {
    error: null,
};

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(
        loginAdmin,
        initialState,
    );

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#fff8f2] px-4">
            <form
                action={formAction}
                className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-stone-950">
                    Вход в админку
                </h1>

                <div className="mt-6 grid gap-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-stone-800"
                    >
                        Пароль
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        autoFocus
                        className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"
                    />
                </div>

                <div className="mt-4 grid gap-2">
                    <label htmlFor="totp" className="text-sm font-medium text-stone-800">
                        Код от приложението за удостоверяване
                    </label>
                    <input
                        id="totp"
                        name="totp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"
                    />
                </div>

                {state.error ? (
                    <p
                        className="mt-3 text-sm text-red-700"
                        aria-live="polite"
                    >
                        {state.error}
                    </p>
                ) : null}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </main>
    );
}

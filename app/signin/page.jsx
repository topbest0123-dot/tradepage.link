const { error } = await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: `${window.location.origin}/auth/callback` } // ok to keep
});

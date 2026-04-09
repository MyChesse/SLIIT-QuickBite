import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    terms: false
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
<main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-20">
<div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[2rem] editorial-shadow bg-surface-container-lowest">
{/* Branding/Visual Side (Editorial Asymmetry) */}
<div className="hidden lg:flex lg:col-span-5 relative bg-primary-container p-12 flex-col justify-between overflow-hidden">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover opacity-30 mix-blend-overlay" data-alt="Modern university campus architecture with clean lines, large glass windows, and students walking in a sunlit academic environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQGd79ipG-VU6oz9A8QKujz9ws0G5Qcd3mcwGE2dO4myhBjuCVe6RLBJBX3ko81EVvTKJJAiIvhOASi7MUyn4YX9FQGsMuvTp3kuV9eroD1Id1i4Y6tPN6X_f0PWjRT_t2oiAkIAHULhlEDslM1VLKmzaqfmJp_yp-rZEOwO3TMjRg2Qroik5_d0AYC7mPh4NTyPvuKX4Bx3krmEl5IJp8Ls-oAabkGGOdYtyuEgcZUk0Xubodz0CuJBv3C0ka0h_0aXCjEjJBLhec"/>
</div>
<div className="relative z-10">
<div className="flex items-center gap-3 mb-8">
<div className="bg-white/10 backdrop-blur-md p-2 rounded-xl">
<span className="material-symbols-outlined text-white text-3xl">restaurant_menu</span>
</div>
<h1 className="font-headline font-extrabold text-2xl tracking-tighter text-white">SLIIT QuickBite</h1>
</div>
<h2 className="font-headline text-4xl font-bold text-white leading-tight mb-6">
                        Fuel your <br/><span className="text-primary-fixed">academic journey</span>
</h2>
<p className="text-primary-fixed/80 text-lg max-w-sm leading-relaxed">
                        Join the premier dining network of SLIIT. Secure, fast, and curated specifically for the academic lifestyle.
                    </p>
</div>
<div className="relative z-10 mt-auto">
<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover" data-alt="Portrait of a smiling university student wearing headphones, looking confident in a library setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqVy7vK8TWDYijc-Yft8ZDdYev93SGF9HO0eQY5fbtNeqRCLvRM6-w669cLkez5K2vpXbPENDmuRYvnS11OgwdOc4-nXWCFz0w2LE75mA_yJ6D22BxB-ZSk8wi_FC11bcLICHqZLAhJqZQ1HlO9jkSTXzd2WXCVflOxn8l5UfZ_P7hQ0HZVyfkhifHeVmouwz7I76BYIAoCvvMgwJmGczu_6b2iw_kegZd0itmJhnYV2u1Gqko9bMKeFNjL385GN02383gXK4lGcnU"/>
</div>
<div>
<p className="text-white font-bold text-sm">Join 5,000+ Students</p>
<p className="text-primary-fixed/70 text-xs">Streamlined campus dining</p>
</div>
</div>
<div className="flex -space-x-3">
<div className="w-8 h-8 rounded-full border-2 border-primary-container bg-slate-300"></div>
<div className="w-8 h-8 rounded-full border-2 border-primary-container bg-slate-400"></div>
<div className="w-8 h-8 rounded-full border-2 border-primary-container bg-slate-500"></div>
<div className="w-8 h-8 rounded-full border-2 border-primary-container flex items-center justify-center bg-secondary text-[10px] text-white font-bold">+2k</div>
</div>
</div>
</div>
</div>
{/* Registration Form Side */}
<div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center">
<div className="mb-10">
<h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Create Account</h3>
<p className="text-on-surface-variant text-sm font-medium">Please enter your details to register for SLIIT QuickBite.</p>
</div>
<form className="space-y-6" onSubmit={handleSubmit}>
{/* Role Selection Toggle (Bento-style layout) */}
<div className="grid grid-cols-2 gap-4 p-1.5 bg-surface-container-low rounded-xl">
<label className="cursor-pointer">
<input checked={formData.userType === 'student'} className="peer hidden" name="userType" type="radio" value="student" onChange={handleChange}/>
<div className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm text-on-surface-variant">
<span className="material-symbols-outlined text-lg">school</span>
                                Student
                            </div>
</label>
<label className="cursor-pointer">
<input checked={formData.userType === 'staff'} className="peer hidden" name="userType" type="radio" value="staff" onChange={handleChange}/>
<div className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm text-on-surface-variant">
<span className="material-symbols-outlined text-lg">badge</span>
                                Staff
                            </div>
</label>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Full Name */}
<div className="space-y-2">
<label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Full Name</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="John Doe" type="text" name="name" value={formData.name} onChange={handleChange} required/>
</div>
</div>
{/* ID */}
<div className="space-y-2">
<label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Student/Staff ID</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">id_card</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="IT21004562" type="text" name="id" value={formData.id} onChange={handleChange} required/>
</div>
</div>
</div>
{/* Email */}
<div className="space-y-2">
<label className="block text-[10px] font-bold uppercase tracking-widest text-outline">University Email</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="john.d@my.sliit.lk" type="email" name="email" value={formData.email} onChange={handleChange} required/>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Password */}
<div className="space-y-2">
<label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="••••••••" type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"/>
</div>
</div>
{/* Confirm Password */}
<div className="space-y-2">
<label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Confirm Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="••••••••" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
</div>
</div>
</div>
{/* Terms & Conditions */}
<div className="flex items-center gap-3">
<div className="relative flex items-center">
<input className="w-5 h-5 rounded-md border-outline-variant bg-surface-container-low text-primary focus:ring-primary/20 cursor-pointer" id="terms" type="checkbox" checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})} required/>
</div>
<label className="text-sm text-on-surface-variant font-medium" htmlFor="terms">
                            I agree to the <a className="text-primary hover:underline underline-offset-4" href="#">Terms and Conditions</a> and <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
                        </label>
</div>
{/* CTA Button */}
<button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
</button>
</form>
<div className="mt-8 pt-8 border-t border-surface-container-low text-center">
<p className="text-on-surface-variant text-sm font-medium">
                        Already have an account? 
                        <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/login">Log In</Link>
</p>
</div>
</div>
</div>
</main>
{/* Footer Decoration (Editorial Academic Style) */}
<footer className="p-8 text-center">
<div className="inline-flex items-center gap-6 opacity-40 grayscale">
<span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">SLIIT</span>
<div className="w-1 h-1 bg-outline rounded-full"></div>
<span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">QuickBite</span>
<div className="w-1 h-1 bg-outline rounded-full"></div>
<span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">v2.0.4</span>
</div>
</footer>
</div>
  );
};

export default Register;
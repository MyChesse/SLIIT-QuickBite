import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    assignedCanteens: [],
    terms: false
  });

  const [canteens, setCanteens] = useState([]);
  const [canteenLoading, setCanteenLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Fetch all canteens when page loads
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/canteens');
        setCanteens(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to load canteens", error);
        toast.error("Could not load canteens");
      } finally {
        setCanteenLoading(false);
      }
    };
    fetchCanteens();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCanteenChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, assignedCanteens: selected });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Extra validation for staff
    if (formData.userType === 'staff' && formData.assignedCanteens.length === 0) {
        toast.error("Staff members must be assigned to at least one canteen");
        setLoading(false);
        return;
    }

    const result = await register(formData);

    if (result.success) {
        toast.success('Registration successful!');

        // Role-based navigation after registration
        if (result.user.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (result.user.role === 'staff') {
            navigate('/inventory');           // ← Staff goes to Inventory
        } else {
            navigate('/menu');                // ← Student goes to Menu
        }
    } else {
        toast.error(result.message);
    }

    setLoading(false);
};

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[2rem] editorial-shadow bg-surface-container-lowest">

          {/* Branding / Visual Side */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-primary-container p-12 flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQGd79ipG-VU6oz9A8QKujz9ws0G5Qcd3mcwGE2dO4myhBjuCVe6RLBJBX3ko81EVvTKJJAiIvhOASi7MUyn4YX9FQGsMuvTp3kuV9eroD1Id1i4Y6tPN6X_f0PWjRT_t2oiAkIAHULhlEDslM1VLKmzaqfmJp_yp-rZEOwO3TMjRg2Qroik5_d0AYC7mPh4NTyPvuKX4Bx3krmEl5IJp8Ls-oAabkGGOdYtyuEgcZUk0Xubodz0CuJBv3C0ka0h_0aXCjEjJBLhec" 
                alt="Campus"
              />
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
          </div>

          {/* Registration Form Side */}
          <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Create Account</h3>
              <p className="text-on-surface-variant text-sm font-medium">Please enter your details to register for SLIIT QuickBite.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 p-1.5 bg-surface-container-low rounded-xl">
                <label className="cursor-pointer">
                  <input 
                    checked={formData.userType === 'student'} 
                    className="peer hidden" 
                    name="userType" 
                    type="radio" 
                    value="student" 
                    onChange={handleChange}
                  />
                  <div className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">school</span>
                    Student
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input 
                    checked={formData.userType === 'staff'} 
                    className="peer hidden" 
                    name="userType" 
                    type="radio" 
                    value="staff" 
                    onChange={handleChange}
                  />
                  <div className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">badge</span>
                    Staff
                  </div>
                </label>
              </div>

              {/* Staff Canteen Assignment */}
              {formData.userType === 'staff' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Assigned Canteen(s) <span className="text-red-500">*</span></label>
                  <select
                    multiple
                    value={formData.assignedCanteens}
                    onChange={handleCanteenChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary min-h-[140px]"
                    required
                  >
                    {canteens.map(canteen => (
                      <option key={canteen._id} value={canteen._id}>
                        🍽️ {canteen.name} - {canteen.location}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple canteens</p>
                </div>
              )}

              {/* Rest of your original form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" 
                      placeholder="John Doe" 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Student/Staff ID</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">id_card</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" 
                      placeholder="IT21004562" 
                      type="text" 
                      name="id" 
                      value={formData.id} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Email, Password, Confirm Password, Terms - keep as you had */}
              {/* (I kept the rest of your form exactly the same for consistency) */}

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">University Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" 
                    placeholder="john.d@my.sliit.lk" 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" 
                      placeholder="••••••••" 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      minLength="6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Confirm Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all font-medium" 
                      placeholder="••••••••" 
                      type="password" 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  className="w-5 h-5 rounded-md border-outline-variant bg-surface-container-low text-primary focus:ring-primary/20 cursor-pointer" 
                  id="terms" 
                  type="checkbox" 
                  checked={formData.terms} 
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})} 
                  required 
                />
                <label className="text-sm text-on-surface-variant font-medium" htmlFor="terms">
                  I agree to the <a className="text-primary hover:underline underline-offset-4" href="#">Terms and Conditions</a> and <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
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
    </div>
  );
};

export default Register;
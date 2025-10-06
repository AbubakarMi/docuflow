import Image from 'next/image';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-background');
  
  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative">
         <Image
            src={loginImage?.imageUrl || "https://picsum.photos/seed/docuflow-login/1920/1080"}
            alt={loginImage?.description || "Abstract background image"}
            fill
            className="object-cover"
            data-ai-hint={loginImage?.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/30" />
      </div>
    </div>
  );
}

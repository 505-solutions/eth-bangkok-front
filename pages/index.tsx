import { MainComponent } from '@/components/MainComponent/MainComponent';
// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <MainComponent />
    </>
  );
}

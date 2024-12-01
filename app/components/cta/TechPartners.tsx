import { Container } from '~/components/ui/Container'
import { FadeIn, FadeInStagger } from '~/components/ui/FadeIn'
import clsx from 'clsx'

export function TechPartners({
    className,
  }: React.ComponentPropsWithoutRef<'div'>) {
    return (
      <div
        className={clsx(
          className,
          'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4',
        )}
      >
        <Container className='mt-16'>
          <FadeIn className="flex items-center gap-x-8">
            <h2 className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-neutral-500">
                Tech Day 2024 Sponsors
            </h2>
            <div className="h-px flex-auto bg-neutral-200" />
          </FadeIn>
          <FadeInStagger faster>
            <ul role="list" className="mt-4 grid grid-cols-3 place-items-center gap-0.5 overflow-hidden sm:mx-0 md:grid-cols-5 md:place-items-start">
              {clients.sponsors.map(({ name, image, alt }) => (
                <li key={name} className="p-8 sm:p-10">
                  <FadeIn>
                    <img 
                        src={image} 
                        alt={alt}
                        className="md:max-lg:mx-auto w-full h-full md:h-16 lg:h-12 md:object-contain"
                        />
                  </FadeIn>
                </li>
              ))}
            </ul>
            </FadeInStagger>
            <FadeIn className="flex items-center gap-x-8 mt-10 lg:mt-24">
            <h2 className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-neutral-500">
                Tech Day 2024 Partners
            </h2>
            <div className="h-px flex-auto bg-neutral-200" />
          </FadeIn>
          <FadeInStagger faster>
            <ul role="list" className="mt-4 grid grid-cols-3 place-items-center gap-0.5 overflow-hidden sm:mx-0 md:grid-cols-5 md:place-items-start">
              {clients.partners.map(({ name, image, alt }) => (
                <li key={name} className="p-8 sm:p-10">
                  <FadeIn>
                    <img 
                      src={image} 
                      alt={alt} 
                      className="md:max-lg:mx-auto w-full h-full md:h-16 lg:h-12 md:object-contain"
                    />
                  </FadeIn>
                </li>
              ))}
            </ul>
          </FadeInStagger>
        </Container>
      </div>
    );
  }

  const clients = {
    sponsors: [
      { name: 'Frost', image: 'https://www.frostbank.com/.resources/aurora-theme/webresources/static/icons/frost-logos/frost-logo-black.svg', alt: 'Frost' },
      { name: 'AT&T', image: 'https://simpleicons.org/icons/atandt.svg', alt: 'AT&T' },
      { name: 'Bexar County Economic Development Department', image: 'https://www.bexar.org/ImageRepository/Document?documentId=19121', alt: 'Bexar County Economic Development Department' },
      { name: 'Rackspace', image: 'https://www.rackspace.com/sites/default/files/2024-06/option%20a.png', alt: 'Rackspace' },
      { name: 'MGV Capital Group', image: 'https://media.licdn.com/dms/image/v2/C4E0BAQEFHjzTrWlkeA/company-logo_200_200/company-logo_200_200/0/1630629517687/mgv_capital_group_logo?e=1737590400&v=beta&t=PirKmvqV_N5W7VuSic4fVNM0ckVoCcgZHVgKO2C7gek', alt: 'MGV Capital Group' },
      { name: 'Port San Antonio', image: 'https://www.portsanantonio.us/sites/default/files/topLogo.png', alt: 'Port San Antonio' },
      { name: 'JP Morgan Chase', image: 'https://www.jpmorganchase.com/content/dam/jpmorganchase/images/logos/jpmc-logo.svg', alt: 'JP Morgan Chase' },
      { name: 'MassChallenge', image: 'https://masschallenge.org/wp-content/uploads/2022/06/mc-logo@2x.png', alt: 'MassChallenge' },
      { name: 'Prime Example', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730051638/PE_rid5v1.svg', alt: 'Prime Example' },
    ],
    partners: [
      { name: 'IBM', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570609/hashing2_g4on33.svg', alt: 'IBM' },
      { name: 'KIPP', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729606469/kipp_oao5ca.svg', alt: 'KIPP' },
      { name: 'Massive', image: 'https://cdn.prod.website-files.com/5eb4731c69fe0858908ee740/5f57d9ba54bfd7c23fd4f144_massive%20logo%402x.png', alt: 'Massive' },
      { name: 'Alamo Angels', image: 'https://alamoangels.com/wp-content/uploads/2024/07/AlamoAngels-Horizontal-Logo-RGB_boxed-Copy.png', alt: 'Alamo Angels' },
      { name: '500 Startups', image: 'https://500.co/images/500-logo-black.svg', alt: '500 Startups' },
      { name: 'Active Capital', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730046360/ac_dj69tc.svg', alt: 'Active Capital' },
      { name: 'Irys', image: 'https://cdn.prod.website-files.com/656523769ed473294d46608c/6611b67923c7219dd09fdb22_irys-logotype.svg', alt: 'Irys' },
      { name: 'Float Me', image: 'https://cdn.prod.website-files.com/6642b643aa34fc2dc7d83344/6642b643aa34fc2dc7d8335a_Logo_black.svg', alt: 'Float me' },
      { name: 'BKC Angel Network', image: 'https://static.wixstatic.com/media/a4e8ec_bcbf94ef54e247c3ac0cc8239145b706~mv2.png/v1/fill/w_552,h_224,al_c,lg_1,q_85,enc_auto/2020-08-17_09-15-03.png', alt: 'Boerne Kendal County Angel network' },
      { name: 'Dux Capital', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730298919/flyers-21-square_4_nnt6c0.png', alt: 'Dux Capital' },
      { name: 'Fabra', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1718688641/fabra_okgahc.png', alt: 'Fabra AI' },
      { name: 'Delta Protect', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730050300/DP_fbmbxo.svg', alt: 'Delta Protect' },
      { name: 'Padilla', image: 'https://padilla.law/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2020/05/cropped-Padilla-Law-logo3767.jpg.webp', alt: 'Padilla' },
      { name: 'Seals', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730051013/seals_klli1w.svg', alt: 'Seals' },
      { name: 'Emerge and Rise', image: 'https://images.squarespace-cdn.com/content/v1/6617fa74e0f1dd166e6380db/a3b6ae0d-cba2-4c94-9045-273787d3f69a/Emerge+and+Rise+logo+.png', alt: 'Emerge and Rise' },
      { name: 'UTSA', image: 'https://www.utsa.edu/marcomstudio/images/utsa-wordmark-rowdy-head-signature-left-aligned.svg', alt: 'UTSA' },
      { name: 'Founder Institute', image: 'https://fi.co/images/FI_logo.png', alt: 'Founder Institute' },
      { name: 'Sputnik ATX', image: 'https://images.squarespace-cdn.com/content/v1/5984957a2994ca9e4bfab3ff/1510851488512-BZPXZI9H3UMLD4WS0W8V/Teal_Sputnik.png?format=1500w', alt: 'Sputnik ATX' },
      { name: 'Yana', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730049225/flyers-19-square_3_wdem6d.png', alt: 'Yana' },
      { name: 'balam', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1730048684/flyers-19-square_2_osq1gp.png', alt: 'balam' },
      { name: 'Angel Hub', image: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/1375226/940696_318615.png', alt: 'Angel Hub' },
      { name: 'nonprofits', image: 'https://www.nonprofitshq.com/wp-content/uploads/2024/05/cropped-logo.a912fc655cad6691d55a.png', alt: 'nonprofits' },
      { name: 'AWS', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570946/amazonwebservices_juiivn.svg', alt: 'AWS' },
      { name: 'Google', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570438/google_rp9nql.svg', alt: 'Google' },
    ],
  };
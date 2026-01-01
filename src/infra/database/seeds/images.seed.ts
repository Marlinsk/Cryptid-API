import { db } from '../connection'
import { images } from '../schemas/images.schema'

export const imageSeedData: Array<typeof images.$inferInsert> = [
  {
    cryptidId: 1,
    url: 'https://cdn.midjourney.com/15907dbd-0ec6-4876-afe4-633d1143b848/0_2.png',
    imageSize: '2:3',
    altText: 'Painting of the Loch Ness Monster',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 2,
    url: 'https://cdn.midjourney.com/8b4364de-1814-4581-9fd3-07ff9ca6f9ef/0_0.png',
    imageSize: '2:3',
    altText: 'Sketch art of Bigfoot in its natural habitat',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 3,
    url: 'https://cdn.midjourney.com/96d15a71-0fe9-41d9-9f64-bd9e99a609d2/0_2.png',
    imageSize: '2:3',
    altText: 'Mothman sitting atop a church watching dreams',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 4,
    url: 'https://cdn.midjourney.com/d4ba9682-a7e2-4f8b-85aa-4eb06b74a675/0_2.png',
    imageSize: '2:3',
    altText: 'Chupacabra with glowing red eyes creeping low through a foggy forest at night, claws extended',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 5,
    url: 'https://cdn.midjourney.com/7f0cae5f-51f9-44e5-942d-9863cc6d552a/0_2.png',
    imageSize: '2:3',
    altText: 'A massive Megalodon rising from deep water with its jaws wide open',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 6,
    url: 'https://cdn.midjourney.com/f2d6fe8e-d492-41a3-9ccb-5ce48efdf6b5/0_0.png',
    imageSize: '2:3',
    altText: 'Kraken',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 7,
    url: 'https://cdn.midjourney.com/ec1322ee-224e-498e-80a8-9db2ff635fef/0_1.png',
    imageSize: '2:3',
    altText: 'Yeti in observation, concept art',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 8,
    url: 'https://cdn.midjourney.com/526bb05b-0f49-4c1c-9df2-4fcc775c6e19/0_1.png',
    imageSize: '2:3',
    altText: 'Gnome working in a gold mine, concept art',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 9,
    url: 'https://cdn.midjourney.com/4b350a0f-19f2-477f-b44b-dd2553c0e7cc/0_3.png',
    imageSize: '2:3',
    altText: 'Portrait of the Gargula',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 10,
    url: 'https://cdn.midjourney.com/2644661b-1d78-42c7-90a7-ffd78785782a/0_0.png',
    imageSize: '2:3',
    altText: 'Portrait of the Jersey Devil',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 11,
    url: 'https://cdn.midjourney.com/1120f588-9774-40e5-a1bb-dd5fac710520/0_0.png',
    imageSize: '2:3',
    altText: 'Batsquatch, concept art',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 12,
    url: 'https://cdn.midjourney.com/b6fd4e3b-ee2b-458d-82d6-8bc60a201032/0_2.png',
    imageSize: '2:3',
    altText: 'Realistic painting of the Holadeira',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 13,
    url: 'https://cdn.midjourney.com/d3950d23-7e5e-4123-b638-8f8f5efd192f/0_2.png',
    imageSize: '2:3',
    altText: 'Academic painting of the Beast of Gévaudan',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 14,
    url: 'https://cdn.midjourney.com/b600a449-0029-4f10-b211-682a727474a4/0_0.png',
    imageSize: '2:3',
    altText: 'Portrait of the Devil of Dover',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 15,
    url: 'https://cdn.midjourney.com/d37a31df-a7d5-46dd-bd9f-800c0437948f/0_3.png',
    imageSize: '2:3',
    altText: 'Realistic oil-painted depiction of a Jackalope with prominent deer antlers',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 16,
    url: 'https://cdn.midjourney.com/1daf885c-b12f-4ba2-beab-f8b5a0871336/0_1.png',
    imageSize: '2:3',
    altText: 'Alien Big Cats, concept art in natural environment',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 17,
    url: 'https://cdn.midjourney.com/e126161a-8650-4fb3-8465-0aa590a1711b/0_0.png',
    imageSize: '2:3',
    altText: 'Skin Walker',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 18,
    url: 'https://cdn.midjourney.com/69828938-928e-4629-bf46-04434895e6dd/0_1.png',
    imageSize: '2:3',
    altText: 'Wendigo concept art',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 19,
    url: 'https://cdn.midjourney.com/ad7557bf-bb9f-42b1-9f02-f0fd25e588bf/0_3.png',
    imageSize: '2:3',
    altText: 'Academic painting of the Chuchunya',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 20,
    url: 'https://cdn.midjourney.com/76c12516-29cf-4f88-a6a9-b51384ae6784/0_3.png',
    imageSize: '2:3',
    altText: 'Concept art for an anatomical study of Leshy',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 21,
    url: 'https://cdn.midjourney.com/833d7d9d-23bd-485a-ada6-696fa948ca9d/0_1.png',
    imageSize: '2:3',
    altText: 'Beast of Bears entity',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 22,
    url: 'https://cdn.midjourney.com/e38e6815-1189-46fa-9c61-6f141249a1b6/0_2.png',
    imageSize: '2:3',
    altText: 'Thunderbird soaring through stormy clouds above a wide mountain valley',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 23,
    url: 'https://cdn.midjourney.com/5f5ed6c3-529d-4834-8290-b5aa8a1acaf2/0_3.png',
    imageSize: '2:3',
    altText: 'Agta sitting on a large tree branch in a misty jungle, smoking while watching the forest below',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 24,
    url: 'https://cdn.midjourney.com/6201e10e-1574-4fec-bfc5-fd5aea7f5f33/0_3.png',
    imageSize: '2:3',
    altText: 'Basilosaurus concept art',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 25,
    url: 'https://cdn.midjourney.com/523fc8c3-6027-4306-997b-4148c1accf87/0_3.png',
    imageSize: '2:3',
    altText: 'Concept art of Champ',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 26,
    url: 'https://cdn.midjourney.com/5f568e3b-c771-4770-9866-3022600648ae/0_0.png',
    imageSize: '2:3',
    altText: "Concept art of Caboclo d'Água, the beast responsible for disturbing fishermen on the São Francisco River",
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 27,
    url: 'https://cdn.midjourney.com/d66eb724-99c1-4378-9324-79a6dd7f885b/0_2.png',
    imageSize: '2:3',
    altText: 'Academic painting of Fear Liath Moor',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 28,
    url: 'https://cdn.midjourney.com/b1072c7b-102e-4257-8ed8-9cdce4240f98/0_1.png',
    imageSize: '2:3',
    altText: 'Academic painting of Momo, the Missouri monster',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 29,
    url: 'https://cdn.midjourney.com/65b7fc84-a688-43de-97ee-95d9bcc1fd22/0_3.png',
    imageSize: '2:3',
    altText: 'Owlman',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
  {
    cryptidId: 30,
    url: 'https://cdn.midjourney.com/69d388e9-d316-44c5-9e70-c5d8d2d42b10/0_2.png',
    imageSize: '2:3',
    altText: 'The Varginha Devil',
    source: 'Image created by AI using artwork and images from the internet about the cryptid as inspiration.',
    license: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)',
  },
]

export async function seedImages() {
  try {
    console.log('Starting images seed...')

    const inserted = await db.insert(images).values(imageSeedData).returning()

    console.log(`✓ Successfully inserted ${inserted.length} images`)
    return inserted
  } catch (error) {
    console.error('Error seeding images:', error)
    throw error
  }
}

// Run seed if called directly
if (require.main === module) {
  seedImages()
    .then(() => {
      console.log('Images seed completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Images seed failed:', error)
      process.exit(1)
    })
}

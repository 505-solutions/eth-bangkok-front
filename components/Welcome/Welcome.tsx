import { Anchor, Center, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" pt={100}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'orange' }}>
          HeptagonAI
        </Text>
      </Title>
      <Text ta="center" size="lg" maw={580} mx="auto" mt="xl">
        <Anchor href="https://github.com/cleverhans-lab/Proof-of-Learning" size="lg"><b>Proof of learning</b></Anchor> AI traing that uses <Anchor href="https://filecoin.io" size="lg"><b>Filecoin</b></Anchor> for dataset storage, <Anchor href="https://phala.network" size="lg"><b>Phala TEE</b></Anchor> for proof verification and <Anchor href="https://flare.network" size="lg"><b>Flare Network</b></Anchor> for data collection and price feeds. 
      </Text>

      <Center><Text>INFO: the project requires local backend</Text></Center>
    </>
  );
}

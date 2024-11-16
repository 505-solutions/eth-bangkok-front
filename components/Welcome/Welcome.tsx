import { Anchor, Text, Title } from '@mantine/core';
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
        <Anchor href="https://github.com/cleverhans-lab/Proof-of-Learning" size="lg">Proof of learning</Anchor> AI traing that uses <Anchor href="https://filecoin.io" size="lg">Filecoin</Anchor> for dataset storage, <Anchor href="https://phala.network" size="lg">Phala TEE infrastructure</Anchor> for proof verification and <Anchor href="https://flare.network" size="lg">Flare Network</Anchor> for data collection and price feeds. 
      </Text>
    </>
  );
}

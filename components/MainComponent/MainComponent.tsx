import { useRef, useState } from 'react';
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import {
  IconBoxModel,
  IconBrandGoogle,
  IconBrandPython,
  IconCancel,
  IconChartArrows,
  IconContract,
  IconCrossFilled,
  IconDatabase,
  IconFileTypeDoc,
  IconGitCompare,
  IconLoadBalancer,
  IconMap,
  IconMoneybag,
  IconShield,
  IconSignLeftFilled,
  IconUser,
} from '@tabler/icons-react';
import axios from 'axios';
import { ethers } from 'ethers';
// import { Prism } from '@mantine/prism';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Code,
  FileButton,
  Group,
  Image,
  JsonInput,
  rem,
  Space,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import flareValidationAbi from '@/contracts/flareValidation.json';

export function MainComponent() {
  const iconStyle = { width: rem(24), height: rem(24) };
  const { primaryWallet } = useDynamicContext();

  const [quote, setQuote] = useState(null);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const resetRef1 = useRef<() => void>(null);
  const resetRef2 = useRef<() => void>(null);

  const clearFile1 = () => {
    setFile1(null);
    resetRef1.current?.();
  };
  const clearFile2 = () => {
    setFile2(null);
    resetRef2.current?.();
  };

  const users = [
    { id: 1, wallet: '0x123...abc', variance: '0.02', contributions: 12, finalReward: 0.1 },
    { id: 2, wallet: '0x456...def', variance: '0.02', contributions: 12, finalReward: 0.1 },
    { id: 3, wallet: '0x789...ghi', variance: '0.02', contributions: 12, finalReward: 0.1 },
  ];

  const handleDownload = async (fileUrl, fileName) => {
    try {
      // Fetch the file as a Blob
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const blob = await response.blob();

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  // * ================================================================
  const handleTeeVerification = async () => {
    try {
      const response = await axios.get('/api/verifyPol');
      console.log('Verification result:', response.data.tdxQuote.quote);
      setQuote(response.data.tdxQuote.quote);
    } catch (error) {
      console.error('Error verifying in TEE', error);
    }
  };

  // * ================================================================
  const flareValidationAddress = '0x13ae453B11c4a3D86fcBaeE0C084DE57A6919C30';
  const [isLoadingTdxQuote, setIsLoadingTdxQuote] = useState(false);
  const aggregateTDXQuote = async () => {
    try {
      setIsLoadingTdxQuote(true);

      const signer = await primaryWallet?.connector.ethers?.getSigner();

      if (!signer) {
        alert('Please connect your wallet');
        return null;
      }

      const contract = new ethers.Contract(flareValidationAddress, flareValidationAbi, signer);

      console.log('Contract:', flareValidationAbi);

      // ethers.utils.hexZeroPad('0x', 32)
      const tx = await contract.verifyTeeLearning(
        '0x00',
        [
          '0x00000000000000000000000000000000000000000000000000006730d6800022',
          '0x00000000000000000000000000000000000000000000000000980d1615541c18',
          true,
        ],
        {
          gasLimit: 2000000,
        }
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);

      //   const response = await axios.get('/api/verifyPol');
      //   console.log('Verification result:', response.data.tdxQuote.quote);
    } catch (error) {
      console.error('Error verifying in TEE', error);
    } finally {
      setIsLoadingTdxQuote(false);
    }
  };

  // * ================================================================
  const [isLoadingfetchDBInfo, setIsLoadingfetchDBInfo] = useState(false);
  const getFlareDBInfo = async () => {
    try {
      setIsLoadingfetchDBInfo(true);

      const signer = await primaryWallet?.connector.ethers?.getSigner();
      if (!signer) {
        alert('Please connect your wallet');
        return null;
      }
      const contract = new ethers.Contract(flareValidationAddress, flareValidationAbi, signer);

      // Make a request to the Flare Verifier Server
      const jsonBody = {
        attestationType: '0x44617461736574496e666f417069000000000000000000000000000000000000',
        sourceId: '0x5745423200000000000000000000000000000000000000000000000000000000',
        messageIntegrityCode: '0x0000000000000000000000000000000000000000000000000000000000000000',
        requestBody: {
          url: 'https://api.freeapi.app/api/v1/public/randomusers/user/random',
          abi_signature: '',
        },
      };

      const response = await axios.post(
        'http://localhost:8000/IDatasetInfoApi/prepareResponse',
        jsonBody,
        {
          headers: {
            'X-Api-Key': '12345',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.status !== 'VALID') {
        alert('failed to get response from the verifier server');
        return null;
      }

      console.log('Response:', response.data.response);

      // ethers.utils.hexZeroPad('0x', 32)
      const tx = await contract.addDatabaseInfo(response.data.response, {
        gasLimit: 2000000,
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);

      await getActiveBalances();
    } catch (error) {
      console.error('Error verifying in TEE', error);
    } finally {
      setIsLoadingfetchDBInfo(false);
    }
  };

  // * ================================================================
  const [addressPayouts, setAddressPayouts] = useState();
  const getActiveBalances = async () => {
    const signer = await primaryWallet?.connector.ethers?.getSigner();
    if (!signer) {
      alert('Please connect your wallet');
      return null;
    }
    const contract = new ethers.Contract(flareValidationAddress, flareValidationAbi, signer);

    const addresses = [
      '0x8A448f9d67F70a3a9C78A3ef0BA204B3c43521a9',
      '0x5a7338D940330109A2722140B7790fC4e286E54C',
      '0x9c4007243CfbF63aFAD9Daf33D331f5a14c81267',
    ];

    const payouts = {};
    for (const address of addresses) {
      const pendingPayout = await contract.pendingPayouts(address);
      payouts[address] = pendingPayout;
    }

    console.log('addressPayouts:', payouts);

    setAddressPayouts(payouts);
  };

  return (
    <div>
      <Center>
        <DynamicWidget />
      </Center>
      <Center>
        <Tabs defaultValue="collect-dataset" style={{ width: '80%' }}>
          <Tabs.List style={{ width: '100%', margin: 'auto', justifyContent: 'center' }}>
            <Tabs.Tab value="collect-dataset" leftSection={<IconBoxModel style={iconStyle} />}>
              Collect dataset
            </Tabs.Tab>
            <Tabs.Tab value="train-model" leftSection={<IconChartArrows style={iconStyle} />}>
              Train model
            </Tabs.Tab>
            <Tabs.Tab value="verify-training" leftSection={<IconGitCompare style={iconStyle} />}>
              Verify training
            </Tabs.Tab>
            <Tabs.Tab value="pay-rewards" leftSection={<IconMoneybag style={iconStyle} />}>
              Distribute rewards
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="collect-dataset">Gallery tab content</Tabs.Panel>

          <Tabs.Panel value="train-model" style={{ display: 'flex' }}>
            <Card
              mt={20}
              mb={20}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 'min-content' }}
            >
              <Card.Section>
                <Center>
                  <ThemeIcon
                    variant="gradient"
                    size={70}
                    aria-label="Gradient action icon"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    mt={20}
                  >
                    <IconBrandPython size={60} />
                  </ThemeIcon>
                </Center>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>Download model</Text>
                <Badge color="pink">Python</Badge>
              </Group>

              <Text size="sm" c="dimmed" mb={20}>
                Download and run the model on your own machine, the training will generate Proof of
                Learning.
              </Text>

              <Code>model.py</Code>

              <Button
                onClick={() =>
                  handleDownload(
                    'https://raw.githubusercontent.com/505-solutions/phala-tee-python/refs/heads/main/model.py',
                    'model.py'
                  )
                }
              >
                Download model
                <IconBrandPython style={{ marginLeft: '8px' }} />
              </Button>
            </Card>

            <Card
              ml={20}
              mt={20}
              mb={20}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 'min-content' }}
            >
              <Card.Section>
                <Center>
                  <ThemeIcon
                    variant="gradient"
                    size={70}
                    aria-label="Gradient action icon"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    mt={20}
                  >
                    <IconDatabase size={60} />
                  </ThemeIcon>
                </Center>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>Download dataset</Text>
                <Badge color="pink">Composite dataset</Badge>
              </Group>

              <Text size="sm" c="dimmed" mb={20}>
                Download the composite dataset made up of users contributions.
              </Text>

              <Code>cifar10-composite.tar.gz</Code>

              <Button
                onClick={() =>
                  handleDownload(
                    'https://raw.githubusercontent.com/505-solutions/phala-tee-python/refs/heads/main/model.py',
                    'model.py'
                  )
                }
                mb={20}
              >
                Download dataset
                <IconDatabase style={{ marginLeft: '8px' }} />
              </Button>
            </Card>

            <Card mt={20} ml={20} mb={20} mr={20} shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3}>Train the model</Title>
              <Text>
                First prepare <Code style={{ display: 'contents' }}>python3.10</Code> environment
                with the following libraries:
              </Text>
              <Code block>
                {`numpy==1.26.4
torch==1.11.0
scipy==1.10.0`}
              </Code>
              <Text mt={30}>Train the model by running the following command in the shell:</Text>
              <Code>python model.py --save-freq=1000</Code>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="verify-training" style={{ display: 'flex' }}>
            <Card
              mt={20}
              mb={20}
              mr={20}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 'min-content' }}
            >
              <Card.Section>
                <Center>
                  <ThemeIcon
                    variant="gradient"
                    size={70}
                    aria-label="Gradient action icon"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    mt={20}
                  >
                    <IconBrandPython size={60} />
                  </ThemeIcon>
                </Center>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>Upload trained model</Text>
                <Badge color="pink">Python</Badge>
              </Group>

              <Text size="sm" c="dimmed" mb={20}>
                Once the model is done training, upload it here to verify the training in TEE.
              </Text>
              <Group>
                <Group justify="center">
                  <FileButton resetRef={resetRef1} onChange={setFile1}>
                    {(props) => (
                      <Button {...props}>
                        Upload trained model
                        <IconBrandPython style={{ marginLeft: '8px' }} />
                      </Button>
                    )}
                  </FileButton>
                </Group>
                {file1 && (
                  <Text size="sm" ta="center" mt="sm">
                    Picked file: <Code>{file1.name}</Code>
                  </Text>
                )}
                <Button disabled={!file1} color="red" onClick={clearFile1}>
                  Reset
                  <IconCancel style={{ marginLeft: '8px' }} />
                </Button>
              </Group>
            </Card>
            <Card
              mt={20}
              mb={20}
              mr={20}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 'min-content' }}
            >
              <Card.Section>
                <Center>
                  <ThemeIcon
                    variant="gradient"
                    size={70}
                    aria-label="Gradient action icon"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    mt={20}
                  >
                    <IconContract size={60} />
                  </ThemeIcon>
                </Center>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>Upload proof of learning (PoL)</Text>
                <Badge color="pink">Proof of learning</Badge>
              </Group>

              <Text size="sm" c="dimmed" mb={20}>
                <b>The proof of learning (PoL)</b> proves that the model was trained correctly on
                the dataset.
              </Text>
              <Group>
                <Group justify="center">
                  <FileButton resetRef={resetRef1} onChange={setFile1}>
                    {(props) => (
                      <Button {...props}>
                        Upload proof of learning
                        <IconContract style={{ marginLeft: '8px' }} />
                      </Button>
                    )}
                  </FileButton>
                </Group>
                {file1 && (
                  <Text size="sm" ta="center" mt="sm">
                    Picked file: <Code>{file1.name}</Code>
                  </Text>
                )}
                <Button disabled={!file1} color="red" onClick={clearFile1}>
                  Reset
                  <IconCancel style={{ marginLeft: '8px' }} />
                </Button>
              </Group>
            </Card>

            <Card
              mt={20}
              mb={20}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 'max-content' }}
            >
              <Title order={3}>Verify proof of learning</Title>
              <p>We verify proof of learning inside Phala networks TEE</p>

              <Button onClick={handleTeeVerification}>Verify proof of learning in TEE</Button>

              {quote && (
                <p>
                  Tdx quote: {quote.slice(0, 20)}...{quote.slice(-5)}
                </p>
              )}
              <Button loading={isLoadingTdxQuote} onClick={aggregateTDXQuote}>
                Aggregate TDX quote
              </Button>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="pay-rewards">
            <Button loading={isLoadingfetchDBInfo} onClick={getFlareDBInfo}>
              Calculate dataset contribution awards
            </Button>
            <Center>
              <Table>
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Variance</th>
                    <th>Contributions</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {addressPayouts
                    ? Object.entries(addressPayouts).map(([address, amount]) => (
                        <tr key={address.toString()}>
                          <td>
                            <Group>
                              <Avatar color="blue" radius="xl">
                                <IconUser />
                              </Avatar>
                              <Text>{address}</Text>
                            </Group>
                          </td>
                          <td>
                            <span>{'Hardcoded'}</span>
                          </td>
                          <td>
                            <span>{'Hardcoded'}</span>
                          </td>
                          <td>
                            <span>
                              {(Number(amount) / 10 ** 8).toFixed(2) + '$'} (
                              {(Number(amount) / 0.02244 / 10 ** 8).toFixed(2) + 'FLR'})
                            </span>
                            <Button>Claim reward</Button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </Center>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </div>
  );
}

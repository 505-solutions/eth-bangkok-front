import { Button, Center, Code, Card, Text, JsonInput, Group, FileButton, Space, Table, Avatar } from '@mantine/core';
// import { Prism } from '@mantine/prism';
import { Tabs, rem } from '@mantine/core';
import { IconBoxModel, IconChartArrows, IconLoadBalancer, IconBrandGoogle, IconShield, IconMap, IconMoneybag, IconDatabase, IconBrandPython, IconGitCompare, IconUser } from '@tabler/icons-react';
import {
    DynamicContextProvider,
    DynamicWidget,
    useDynamicContext,
  } from '@dynamic-labs/sdk-react-core';
import { showNotification } from '@mantine/notifications';
import { useRef, useState } from 'react';
import axios from 'axios';


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

    const handleTeeVerification = async () => {
        try {
            const response = await axios.get('/api/verifyPol');
            console.log('Verification result:', response.data.tdxQuote.quote);
            setQuote(response.data.tdxQuote.quote);
        } catch (error) {
          console.error('Error verifying in TEE', error);
        }
    }

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

                <Tabs.Panel value="collect-dataset">
                    Gallery tab content
                </Tabs.Panel>

                <Tabs.Panel value="train-model">
                    <Button
                      onClick={() => handleDownload(
                        'https://raw.githubusercontent.com/cleverhans-lab/Proof-of-Learning/refs/heads/main/model.py',
                        'model.py'
                    )}
                    >
                        Download model
                        <IconBrandPython style={{ marginLeft: '8px' }} />
                    </Button>

                    <Button
                      onClick={() => handleDownload(
                            'https://raw.githubusercontent.com/cleverhans-lab/Proof-of-Learning/refs/heads/main/model.py',
                            'model.py'
                        )}
                    >
                        Download dataset
                        <IconDatabase style={{ marginLeft: '8px' }} />
                    </Button>
                </Tabs.Panel>

                <Tabs.Panel value="verify-training">
                    <Center><p>Upload final model and proof</p></Center>
                    <Group>
                        <Group justify="center">
                            <FileButton resetRef={resetRef1} onChange={setFile1} accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>Upload trained model</Button>}
                            </FileButton>
                            <Button disabled={!file1} color="red" onClick={clearFile1}>
                            Reset
                            </Button>
                        </Group>
                        {file1 && (
                            <Text size="sm" ta="center" mt="sm">
                            Picked file: {file1.name}
                            </Text>
                        )}
                    </Group>
                    <Group>
                        <Group justify="center">
                            <FileButton resetRef={resetRef2} onChange={setFile2} accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>Upload proof of learning</Button>}
                            </FileButton>
                            <Button disabled={!file2} color="red" onClick={clearFile2}>
                            Reset
                            </Button>
                        </Group>
                        {file2 && (
                            <Text size="sm" ta="center" mt="sm">
                            Picked file: {file2.name}
                            </Text>
                        )}
                    </Group>
                    <Space h={20} />

                    <Button
                      onClick={handleTeeVerification}
                    >
                        Verify proof of learning in TEE
                    </Button>

                    { quote &&
                    <p>Tdx quote: {quote.slice(0, 20)}...{quote.slice(-5)}</p>
                    }
                    <Button>Aggregate TDX quote</Button>

                </Tabs.Panel>

                <Tabs.Panel value="pay-rewards">
                    <Button>Calculate dataset contribution awards</Button>
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
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <Group>
                                                <Avatar color="blue" radius="xl">
                                                    <IconUser />
                                                </Avatar>
                                                <Text>{user.wallet}</Text>
                                            </Group>
                                        </td>
                                        <td>
                                            <span>{user.variance}</span>
                                        </td>
                                        <td>
                                            <span>{user.contributions}</span>
                                        </td>
                                        <td>
                                            <span>{user.finalReward}</span>
                                            <Button>Claim reward</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Center>
                </Tabs.Panel>
            </Tabs>
        </Center>
        </div>
    );
}

import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useMemo } from 'react';
import { useGetGames } from '../api/games';
import { useGetScoreboard } from '../api/scoreboard';
import { useGetUsers } from '../api/users';
import { IGame, IUser } from '../interfaces';

const Scoreboard = () => {
    const { users } = useGetUsers();
    const { games } = useGetGames();
    const { scores } = useGetScoreboard();

    const usersWithScore = useMemo(() => {
        const userScores = _.groupBy(scores, (score) => score.user_id);
        const result = _.map(users, (user: IUser) => {
            const totalScore = userScores[user.id]?.reduce((prev, userScore) => prev + Number(userScore.score), 0);
            return { ...user, totalScore, scores: _.map(games, (game) => _.find(userScores[user.id], (userScore) => userScore.game_id == game.id)) };
        });
        return result.sort((a: any, b: any) => {
            return b.totalScore - a.totalScore;
        });
    }, [users, games, scores]);

    return (
        <Flex p={{ base: '16px', lg: '96px' }} justify='center'>
            <Flex w='full' maxW='1440px' bg='black' p='16px' rounded='16px'>
                <TableContainer w='full'>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th />
                                <Th>
                                    USERNAME
                                </Th>
                                <Th>
                                    TOTAL
                                </Th>
                                {games.map((game: IGame) => <Th key={game.id}>{game.name}</Th>)}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usersWithScore.map((user: any, index: number) => {
                                return (
                                    <Tr key={index}>
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td>
                                            {user.name}
                                        </Td>
                                        <Td>
                                            {user.totalScore}
                                        </Td>
                                        {user.scores.map((score: any, index: number) => <Td key={index}>{score?.score}</Td>)}
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    )
}

export default Scoreboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, Typography, Paper, Box, Grid, 
  CircularProgress, Chip, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination,
  AppBar, Toolbar, Button
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Whatshot as PopularIcon,
  School as SubjectIcon, 
  Event as YearIcon,
  Timer as TermIcon,
  Home as HomeIcon,
  CloudUpload as UploadIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const LeaderboardQP = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/leaderboard', 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        setQuestions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Get trophy color based on rank
  const getTrophyColor = (index) => {
    if (index === 0) return '#FFD700'; // Gold
    if (index === 1) return '#C0C0C0'; // Silver
    if (index === 2) return '#CD7F32'; // Bronze
    return '#64748B'; // Default slate color
  };
  
  // Get trophy size based on rank
  const getTrophySize = (index) => {
    if (index < 3) return 'large';
    return 'medium';
  };

  // Get background gradient for top 3 rows
  const getRowStyle = (index) => {
    if (index === 0) return { background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,1) 100%)' };
    if (index === 1) return { background: 'linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(255,255,255,1) 100%)' };
    if (index === 2) return { background: 'linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(255,255,255,1) 100%)' };
    return {};
  };

  // Get chip color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HARD': return 'error';
      default: return 'default';
    }
  };

  return (
    <div style={{ paddingTop: '64px' }}>
      <AppBar position="fixed" color="primary" sx={{ boxShadow: 2, backgroundColor: "#121212" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Question Rankings
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              startIcon={<UploadIcon />}
              onClick={() => navigateTo('/uploadQP')}
              sx={{ textTransform: 'none' }}
            >
              Upload Papers
            </Button>

            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <TrophyIcon sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Question Leaderboard
            </Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom color="text.secondary" mb={3}>
            Most frequently appearing questions across all question papers
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell align="center" sx={{ width: '10%' }}>Rank</TableCell>
                      <TableCell sx={{ width: '40%' }}>Question</TableCell>
                      <TableCell align="center" sx={{ width: '10%' }}>Occurrences</TableCell>
                      <TableCell align="center" sx={{ width: '10%' }}>Marks</TableCell>                   
                      <TableCell align="center" sx={{ width: '15%' }}>Difficulty</TableCell>
                      <TableCell align="center" sx={{ width: '15%' }}>Paper Info</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((question, index) => {
                        const actualIndex = page * rowsPerPage + index;
                        return (
                          <TableRow 
                            key={question._id}
                            sx={{ 
                              '&:hover': { backgroundColor: '#f9f9f9' }, 
                              ...getRowStyle(actualIndex)
                            }}
                          >
                            <TableCell align="center">
                              <Box 
                                display="flex" 
                                justifyContent="center" 
                                alignItems="center" 
                                flexDirection="column"
                              >
                                <Typography variant="h6" fontWeight="bold">
                                  #{actualIndex + 1}
                                </Typography>
                                {actualIndex < 10 && (
                                  <TrophyIcon 
                                    sx={{ 
                                      color: getTrophyColor(actualIndex),
                                      fontSize: getTrophySize(actualIndex) === 'large' ? 36 : 28
                                    }} 
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography 
                                sx={{ 
                                  fontWeight: actualIndex < 3 ? 500 : 400,
                                  fontSize: actualIndex < 3 ? '1.05rem' : '1rem'
                                }}
                              >
                                {question.content.length > 150 
                                  ? `${question.content.substring(0, 150)}...` 
                                  : question.content}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                icon={<PopularIcon />} 
                                label={question.occurrenceCount} 
                                color={actualIndex < 3 ? 'primary' : 'default'}
                                variant={actualIndex < 3 ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {question.marks} marks
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={question.difficulty} 
                                color={getDifficultyColor(question.difficulty)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              {question.questionPaperId && (
                                <Box display="flex" flexDirection="column" gap={1} alignItems="center">
                                  <Tooltip title="Subject">
                                    <Chip 
                                      icon={<SubjectIcon />}
                                      label={question.questionPaperId.subject}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Tooltip>
                                  <Box display="flex" gap={1}>
                                    <Tooltip title="Year">
                                      <Chip 
                                        icon={<YearIcon />}
                                        label={question.questionPaperId.year}
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                    <Tooltip title="Term">
                                      <Chip 
                                        icon={<TermIcon />}
                                        label={question.questionPaperId.term}
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                  </Box>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={questions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default LeaderboardQP;

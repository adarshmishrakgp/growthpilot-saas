/* eslint-disable react-hooks/exhaustive-deps */
/*  ~1000 lines! Sponsored by Gen-Z SaaS UIs inspired by Zapier, Make, HubSpot  */

import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    forwardRef,
    CSSProperties,
  } from 'react';
  import 'reactflow/dist/style.css';
  import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    MarkerType,
    ReactFlowInstance,
    Edge,
    Node,
    XYPosition,
  } from 'reactflow';
  import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Drawer,
    Divider,
    TextField,
    Tooltip,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Switch,
    Snackbar,
    Alert,
    useMediaQuery,
    useTheme,
    LinearProgress,
    Grid,
    InputAdornment,
    Slide,
    CircularProgress,
    FormControlLabel,
    MenuList,
  } from '@mui/material';
  import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
  import {
    PlayArrow,
    Save,
    Publish,
    Preview,
    Add,
    Delete,
    ContentCopy,
    Search,
    Settings,
    Download,
    Upload,
    Bolt,
    Tag,
    AccessTime,
    Notifications,
    CallSplit,
    Person,
    WhatsApp,
    Email,
    EmojiObjects,
    CheckCircle,
    PauseCircle,
    ArrowForward,
    ArrowBack,
    Timeline,
    BarChart,
    Info,
    Close,
    History,
    Restore,
    GroupWork,
  } from '@mui/icons-material';
  import { v4 as uuidv4 } from 'uuid';
  
  /**-------------------------
   * 1. THEME CONFIGURATION
   *--------------------------*/
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: { default: '#f0f4ff' },
      primary: { main: '#6366f1' },
      secondary: { main: '#4ade80' },
    },
    typography: { fontFamily: 'Manrope, Inter, sans-serif' },
  });
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#1a1a2e' },
      primary: { main: '#8b5cf6' },
      secondary: { main: '#22c55e' },
    },
    typography: { fontFamily: 'Manrope, Inter, sans-serif' },
  });
  
  /**-------------------------
   * 2. BLOCK TYPES & COLORS
   *--------------------------*/
  type BlockType =
    | 'trigger'
    | 'wait'
    | 'action'
    | 'decision'
    | 'tag'
    | 'notify';
  
  interface BlockSpec {
    type: BlockType;
    label: string;
    color: string;
    icon: JSX.Element;
    defaultData: any;
  }
  
  const BLOCK_SPECS: BlockSpec[] = [
    {
      type: 'trigger',
      label: 'Trigger',
      color: '#fde047',
      icon: <Bolt sx={{ color: '#facc15' }} />,
      defaultData: {
        label: 'New trigger',
        description: '',
        type: 'trigger',
        meta: {},
      },
    },
    {
      type: 'wait',
      label: 'Wait',
      color: '#60a5fa',
      icon: <AccessTime sx={{ color: '#3b82f6' }} />,
      defaultData: {
        label: 'Wait 1 hr',
        time: 1,
        unit: 'hours',
        type: 'wait',
      },
    },
    {
      type: 'action',
      label: 'Action',
      color: '#4ade80',
      icon: <WhatsApp sx={{ color: '#22c55e' }} />,
      defaultData: {
        label: 'Send WhatsApp',
        channel: 'WhatsApp',
        message: '',
        type: 'action',
      },
    },
    {
      type: 'decision',
      label: 'Decision',
      color: '#f472b6',
      icon: <CallSplit sx={{ color: '#ec4899' }} />,
      defaultData: {
        label: 'Decision point',
        condition: '',
        type: 'decision',
      },
    },
    {
      type: 'tag',
      label: 'Tag',
      color: '#fbbf24',
      icon: <Tag sx={{ color: '#f59e42' }} />,
      defaultData: {
        label: 'Add Tag',
        tag: '',
        type: 'tag',
      },
    },
    {
      type: 'notify',
      label: 'Notify',
      color: '#a78bfa',
      icon: <Notifications sx={{ color: '#8b5cf6' }} />,
      defaultData: {
        label: 'Notify team',
        recipient: '',
        type: 'notify',
      },
    },
  ];
  
  const BLOCK_TYPE_COLORS: Record<BlockType, string> = BLOCK_SPECS.reduce(
    (acc, cur) => ({ ...acc, [cur.type]: cur.color }),
    {} as Record<BlockType, string>
  );
  
  /**-------------------------
   * 3. CUSTOM NODE COMPONENT
   *--------------------------*/
  interface CustomNodeProps {
    data: any;
    selected: boolean;
    id: string;
  }
  
  const CustomNode = forwardRef<HTMLDivElement, CustomNodeProps>(
    ({ data, selected, id }, ref) => {
      const spec = BLOCK_SPECS.find((b) => b.type === data.type);
      const color = spec?.color || '#fff';
  
      const commonStyle: CSSProperties = {
        padding: 12,
        borderRadius: 12,
        background: color,
        boxShadow: selected
          ? '0 0 0 3px #6366f1'
          : '0 2px 8px rgba(99,102,241,0.13)',
        minWidth: 180,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
      };
  
      return (
        <Box
          ref={ref}
          sx={{
            ...commonStyle,
            transform: selected ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {/* Icon + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {spec?.icon}
            <Typography sx={{ ml: 1, fontWeight: 700 }}>{data.label}</Typography>
          </Box>
          {/* Subtitle */}
          <Typography
            fontSize={13}
            fontWeight={500}
            color="#444"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.description ||
              data.message ||
              data.condition ||
              data.tag ||
              data.recipient ||
              ''}
          </Typography>
          {/* Float label for decisions */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              right: 8,
              fontSize: 11,
              background: '#fff',
              px: 1,
              borderRadius: 4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            {data.type}
          </Box>
        </Box>
      );
    }
  );
  
  const nodeTypes = { custom: CustomNode };
  
  /**-------------------------
   * 4. MAIN COMPONENT
   *--------------------------*/
  const WorkflowAutomationPage: React.FC = () => {
    const systemTheme = useTheme();
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = useState(prefersDark);
  
    const themeApplied = darkMode ? darkTheme : lightTheme;
  
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<any>[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>[]>([]);
    const [reactFlowInstance, setReactFlowInstance] =
      useState<ReactFlowInstance | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
    const [selected, setSelected] = useState<Node<any> | null>(null);
    const [aiBanners, setAiBanners] = useState<
      { x: number; y: number; message: string; id: string }[]
    >([]);
    const [showHistory, setShowHistory] = useState(false);
    const [versions, setVersions] = useState<
      { id: string; ts: number; nodes: Node<any>[]; edges: Edge<any>[] }[]
    >([]);
    const [metrics, setMetrics] = useState({
      ctr: 0.42,
      reply: 0.31,
      score: 0.88,
    });
    const [snackbar, setSnackbar] = useState({
      open: false,
      severity: 'success' as 'success' | 'error',
      message: '',
    });
    const [importJSON, setImportJSON] = useState('');
    const [exportJSON, setExportJSON] = useState('');
    const [validJSONError, setValidJSONError] = useState('');
    const [simulating, setSimulating] = useState(false);
  
    /** Initialize flow with a trigger node */
    useEffect(() => {
      const start = {
        id: 'start-node-1',
        type: 'custom',
        position: { x: 200, y: 200 },
        data: {
          ...BLOCK_SPECS[0].defaultData,
          label: 'User downloads brochure',
        },
      };
      setNodes([start]);
      setEdges([]);
      pushVersion('Initial state');
    }, []);
  
    const pushVersion = (label = '') => {
      setVersions((v) => [
        ...v,
        {
          id: uuidv4(),
          ts: Date.now(),
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        },
      ]);
    };
  
    /** LOGIC: Drag & Drop */
    const onDragStart = (e: React.DragEvent, type: BlockType) => {
      e.dataTransfer.setData('application/reactflow', type);
      e.dataTransfer.effectAllowed = 'move';
    };
    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };
    const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      const dt = e.dataTransfer.getData('application/reactflow');
      const spec = BLOCK_SPECS.find((b) => b.type === dt);
      if (!spec) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const pos = reactFlowInstance.project({
        x: e.clientX - bounds.left - 80,
        y: e.clientY - bounds.top - 30,
      });
      const newNode: Node<any> = {
        id: uuidv4(),
        type: 'custom',
        position: pos,
        data: { ...spec.defaultData },
      };
      setNodes((nds) => nds.concat(newNode));
      pushVersion('Add node');
      createAiBanner(pos, `AI: consider connecting this ${spec.label}.`);
    };
  
    /** Connect edges with labels */
    const onConnect = (p: any) => {
      const label =
        selected && selected.data.type === 'decision' ? 'Yes' : '';
      setEdges((e) =>
        addEdge(
          {
            ...p,
            type: ConnectionLineType.SmoothStep,
            markerEnd: { type: MarkerType.ArrowClosed },
            label,
          },
          e
        )
      );
      pushVersion('Add edge');
    };
  
    /** Node selection */
    const onNodeClick = (_: any, n: Node<any>) => {
      setSelected(n);
    };
    const onPaneClick = () => {
      setSelected(null);
    };
  
    /** Duplicate & delete nodes */
    const duplicateNode = (n: Node<any>) => {
      const clone = {
        ...n,
        id: uuidv4(),
        position: {
          x: n.position.x + 30,
          y: n.position.y + 30,
        },
        data: { ...n.data },
      };
      setNodes((nds) => nds.concat(clone));
      pushVersion('Duplicate node');
      if (reactFlowInstance) {
        createAiBanner(clone.position, `AI: new duplicate—connect it!`);
      }
    };
    const deleteNode = (id: string) => {
      setNodes((nds) => nds.filter((x) => x.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelected(null);
      pushVersion('Delete node');
      setSnackbar({ open: true, severity: 'success', message: 'Node deleted' });
    };
  
    /** Config panel changes */
    const handleConfigChange = (field: string, value: any) => {
      if (!selected) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selected.id
            ? { ...n, data: { ...n.data, [field]: value } }
            : n
        )
      );
      setSelected((s) =>
        s ? { ...s, data: { ...s.data, [field]: value } } : null
      );
    };
  
    /** JSON Export/Import */
    const handleExport = () => {
      const j = JSON.stringify({ nodes, edges }, null, 2);
      setExportJSON(j);
      setSnackbar({ open: true, severity: 'success', message: 'Exported!' });
    };
    const handleImport = (json: string) => {
      try {
        const obj = JSON.parse(json);
        setNodes(obj.nodes);
        setEdges(obj.edges);
        setImportJSON('');
        setValidJSONError('');
        setSnackbar({ open: true, severity: 'success', message: 'Imported!' });
        pushVersion('Import JSON');
      } catch (e) {
        setValidJSONError('Invalid JSON format');
      }
    };
  
    /** Simulate */
    const handleSimulate = () => {
      setSimulating(true);
      pushVersion('Simulate');
      let step = 0;
      const steps = nodes.length;
      const interval = setInterval(() => {
        step++;
        setMetrics((m) => ({
          ...m,
          ctr: Math.min(1, m.ctr + 0.01),
          reply: Math.min(1, m.reply + 0.005),
        }));
        if (step >= steps) {
          clearInterval(interval);
          setSimulating(false);
          setSnackbar({ open: true, severity: 'success', message: 'Simulation done!' });
        }
      }, 300);
    };
  
    /** AI banners & mock suggestions */
    const createAiBanner = (pos: XYPosition, message: string) => {
      setAiBanners((b) => [
        ...b,
        { x: pos.x, y: pos.y, message, id: uuidv4() },
      ]);
    };
    const dismissBanner = (id: string) => {
      setAiBanners((b) => b.filter((x) => x.id !== id));
    };
  
    /** Rollback to version */
    const restoreVersion = (v: typeof versions[0]) => {
      setNodes(v.nodes);
      setEdges(v.edges);
      setShowHistory(false);
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Restored to previous version',
      });
    };
  
    return (
      <ThemeProvider theme={themeApplied}>
        <ReactFlowProvider>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              p: { xs: 1, md: 3 },
              background: themeApplied.palette.background.default,
            }}
          >
            {/* Top Nav */}
            <AppBar
              position="static"
              color="transparent"
              sx={{
                p: 1,
                borderRadius: 2,
                mb: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Toolbar sx={{ gap: 1 }}>
                <Timeline sx={{ fontSize: 30, color: themeApplied.palette.primary.main }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, flexGrow: 1 }}
                >
                  Gen‑Z Flow Builder
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode((d) => !d)}
                    />
                  }
                  label="Dark Mode"
                />
                <Tooltip title="Save">
                  <IconButton onClick={() => pushVersion('Manual save')}>
                    <Save />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Publish">
                  <IconButton>
                    <Publish />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Simulate">
                  <IconButton onClick={handleSimulate}>
                    <Preview />
                  </IconButton>
                </Tooltip>
                <Tooltip title="History">
                  <IconButton onClick={() => setShowHistory((s) => !s)}>
                    <History />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export JSON">
                  <IconButton onClick={handleExport}>
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Import JSON">
                  <IconButton onClick={() => setImportJSON((j) => j ? '' : '{}')} >
                    <Upload />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
  
            <Grid container spacing={2}>
              {/* Sidebar */}
              <Grid item xs={12} md={1}>
                <Paper
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    background: themeApplied.palette.background.paper,
                  }}
                >
                  {BLOCK_SPECS.map((b) => (
                    <Tooltip key={b.type} title={b.label} placement="right">
                      <Button
                        draggable
                        onDragStart={(e) => onDragStart(e, b.type)}
                        sx={{
                          mb: 1,
                          px: 1,
                          py: 2,
                          borderRadius: 1,
                          background: b.color,
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'transform 0.1s',
                          '&:hover': { transform: 'scale(1.05)' },
                        }}
                      >
                        {b.icon}
                        <Typography sx={{ flexGrow: 1, ml: 1, fontWeight: 700, fontSize: 13 }}>
                          {b.label}
                        </Typography>
                      </Button>
                    </Tooltip>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <TextField
                    placeholder="Search nodes..."
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                </Paper>
              </Grid>
  
              {/* Canvas */}
              <Grid item xs={12} md={8}>
                <Box
                  ref={reactFlowWrapper}
                  sx={{
                    borderRadius: 2,
                    background:
                      themeApplied.palette.mode === 'light'
                        ? '#e0e7ff'
                        : '#2e2e3e',
                    height: 700,
                    position: 'relative',
                  }}
                >
                  {aiBanners.map((b) => (
                    <Slide key={b.id} direction="down" in mountOnEnter unmountOnExit timeout={300}>
                      <Paper
                        sx={{
                          position: 'absolute',
                          top: b.y,
                          left: b.x,
                          background: themeApplied.palette.primary.main,
                          color: '#fff',
                          p: 1,
                          px: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => dismissBanner(b.id)}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                          {b.message}
                        </Typography>
                      </Paper>
                    </Slide>
                  ))}
  
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    snapToGrid
                    snapGrid={[16, 16]}
                    panOnScroll
                    zoomOnScroll
                    style={{ borderRadius: 12 }}
                  >
                    <MiniMap
                      nodeStrokeWidth={2}
                      nodeColor={(n) =>
                        BLOCK_TYPE_COLORS[
                          (n.data.type as BlockType) || 'trigger'
                        ]
                      }
                    />
                    <Controls showInteractive={false} />
                    <Background gap={12} color="#fff" />
                  </ReactFlow>
                </Box>
  
                {/* Simulating overlay */}
                {simulating && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 260,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: themeApplied.palette.background.paper,
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    <CircularProgress
                      size={28}
                      color="primary"
                      sx={{ mr: 2 }}
                    />
                    <Typography sx={{ fontWeight: 700 }}>
                      Simulating...
                    </Typography>
                  </Box>
                )}
  
                {/* Export JSON drawer */}
                <Drawer
                  anchor="right"
                  open={!!exportJSON}
                  onClose={() => setExportJSON('')}
                >
                  <Box sx={{ p: 2, width: 400 }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                      Exported JSON
                    </Typography>
                    <TextField
                      value={exportJSON}
                      multiline
                      minRows={12}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      onClick={() => {
                        navigator.clipboard.writeText(exportJSON);
                        setSnackbar({ open: true, severity: 'success', message: 'Copied!' });
                      }}
                    >
                      Copy
                    </Button>
                  </Box>
                </Drawer>
  
                {/* Import JSON drawer */}
                <Drawer
                  anchor="right"
                  open={!!importJSON}
                  onClose={() => setImportJSON('')}
                >
                  <Box sx={{ p: 2, width: 400 }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                      Import JSON
                    </Typography>
                    <MenuList>
                      <ListItem>
                        <TextField
                          value={importJSON}
                          onChange={(e) => setImportJSON(e.target.value)}
                          placeholder="Paste JSON"
                          multiline
                          minRows={8}
                          fullWidth
                        />
                      </ListItem>
                      {validJSONError && (
                        <Typography color="error" sx={{ ml: 2 }}>
                          {validJSONError}
                        </Typography>
                      )}
                      <ListItem>
                        <Button
                          variant="contained"
                          onClick={() => handleImport(importJSON)}
                        >
                          Import
                        </Button>
                      </ListItem>
                    </MenuList>
                  </Box>
                </Drawer>
              </Grid>
  
              {/* Config Panel + Metrics */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: themeApplied.palette.background.paper,
                    height: 700,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Config */}
                  <Box>
                    {selected ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          {BLOCK_SPECS.find(
                            (b) => b.type === selected.data.type
                          )?.icon}
                          <Typography
                            sx={{ ml: 1, fontWeight: 700, fontSize: 18 }}
                          >
                            {selected.data.label}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <Tooltip title="Duplicate">
                            <IconButton
                              size="small"
                              onClick={() => duplicateNode(selected)}
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => deleteNode(selected.id)}
                            >
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        {Object.entries(selected.data).map(
                          ([key, val]) =>
                            !['type'].includes(key) && (
                              <TextField
                                key={key}
                                label={key}
                                variant="outlined"
                                size="small"
                                value={val}
                                onChange={(e) =>
                                  handleConfigChange(key, e.target.value)
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                            )
                        )}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => {
                            setSnackbar({
                              open: true,
                              severity: 'success',
                              message: 'Saved!',
                            });
                            pushVersion('Update node');
                          }}
                        >
                          Save Config
                        </Button>
                      </>
                    ) : (
                      <Box
                        sx={{
                          textAlign: 'center',
                          mt: 10,
                        }}
                      >
                        <Info sx={{ fontSize: 48 }} color="primary" />
                        <Typography sx={{ fontWeight: 700, mt: 1 }}>
                          Select a block
                        </Typography>
                      </Box>
                    )}
                  </Box>
  
                  {/* Metrics */}
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {[
                        { key: 'ctr', label: 'CTR', color: 'primary' },
                        {
                          key: 'reply',
                          label: 'Reply Rate',
                          color: 'secondary',
                        },
                        { key: 'score', label: 'Score', color: 'warning' },
                      ].map((m) => (
                        <Grid item xs={4} key={m.key}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                            {m.label}
                          </Typography>
                          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                            {Math.round(
                              (metrics as any)[m.key] * 100
                            )}
                            %
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (metrics as any)[m.key] *
                              100
                            }
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              background:
                                themeApplied.palette.grey[300],
                              '& .MuiLinearProgress-bar': {
                                background:
                                  (themeApplied.palette as any)[
                                    m.color
                                  ].main,
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 12, color: 'gray' }}>
                        Sparkbars = simulation progress
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
  
            {/* Version History Drawer */}
            <Drawer
              anchor="bottom"
              open={showHistory}
              onClose={() => setShowHistory(false)}
              PaperProps={{ sx: { height: 300 } }}
            >
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  Version History
                </Typography>
                <List>
                  {versions
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((v) => (
                      <ListItem
                        key={v.id}
                        secondaryAction={
                          <Tooltip title="Restore">
                            <IconButton
                              onClick={() => restoreVersion(v)}
                            >
                              <Restore />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemIcon>
                          <Avatar>
                            {new Date(v.ts).getHours()}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={new Date(
                            v.ts
                          ).toLocaleString()}
                          secondary={`${v.nodes.length} nodes, ${v.edges.length} edges`}
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Drawer>
  
            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={2000}
              onClose={() =>
                setSnackbar((s) => ({ ...s, open: false }))
              }
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Alert
                severity={snackbar.severity}
                onClose={() =>
                  setSnackbar((s) => ({ ...s, open: false }))
                }
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </ReactFlowProvider>
      </ThemeProvider>
    );
  };
  
  export default WorkflowAutomationPage;
  




// import React, { useState, useCallback, useRef, useMemo, createContext, useContext } from 'react';
// import 'reactflow/dist/style.css';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   ConnectionLineType,
//   MarkerType,
//   ReactFlowInstance,
//   Node,
//   Edge,
//   NodeTypes,
//   Panel,
// } from 'reactflow';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   IconButton,
//   Drawer,
//   Divider,
//   TextField,
//   Chip,
//   Tooltip,
//   AppBar,
//   Toolbar,
//   Menu,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Switch,
//   Snackbar,
//   Alert,
//   useMediaQuery,
//   useTheme,
//   LinearProgress,
//   Grid,
//   InputAdornment,
//   Slide,
//   CircularProgress,
//   Fade,
//   Grow,
//   CssBaseline,
//   createTheme,
//   ThemeProvider,
//   Tabs,
//   Tab,
//   Stack,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import {
//   PlayArrow,
//   Save,
//   Publish,
//   Preview,
//   Add,
//   Delete,
//   ContentCopy,
//   Search,
//   Settings,
//   Download,
//   Upload,
//   Bolt,
//   Tag,
//   AccessTime,
//   Notifications,
//   CallSplit,
//   Person,
//   WhatsApp,
//   Email,
//   EmojiObjects,
//   CheckCircle,
//   PauseCircle,
//   ArrowForward,
//   ArrowBack,
//   Timeline,
//   BarChart,
//   Info,
//   Close,
//   Group as GroupIcon,
//   Undo,
//   Redo,
//   LightMode,
//   DarkMode,
//   ViewModule,
//   AutoAwesome,
//   History,
//   FolderOpen,
// } from '@mui/icons-material';
// import { v4 as uuidv4 } from 'uuid';

// // --- Theme Context for Light/Dark Mode ---
// const ColorModeContext = createContext({ toggleColorMode: () => {} });

// // --- Block Types & Colors ---
// const BLOCK_TYPES = [
//   {
//     type: 'trigger',
//     label: 'Trigger',
//     color: '#fde047',
//     icon: <Bolt sx={{ color: '#facc15' }} />,
//     defaultData: { label: 'User downloads brochure', description: '', type: 'trigger' },
//   },
//   {
//     type: 'wait',
//     label: 'Wait',
//     color: '#60a5fa',
//     icon: <AccessTime sx={{ color: '#3b82f6' }} />,
//     defaultData: { label: 'Wait 2 days', time: 2, unit: 'days', type: 'wait' },
//   },
//   {
//     type: 'action',
//     label: 'Action',
//     color: '#4ade80',
//     icon: <WhatsApp sx={{ color: '#22c55e' }} />,
//     defaultData: { label: 'Send WhatsApp message', channel: 'WhatsApp', message: '', type: 'action' },
//   },
//   {
//     type: 'decision',
//     label: 'Decision',
//     color: '#f472b6',
//     icon: <CallSplit sx={{ color: '#ec4899' }} />,
//     defaultData: { label: 'Did they click?', condition: '', type: 'decision' },
//   },
//   {
//     type: 'tag',
//     label: 'Tag',
//     color: '#fbbf24',
//     icon: <Tag sx={{ color: '#f59e42' }} />,
//     defaultData: { label: 'Add "engaged" tag', tag: 'engaged', type: 'tag' },
//   },
//   {
//     type: 'notify',
//     label: 'Notify',
//     color: '#a78bfa',
//     icon: <Notifications sx={{ color: '#8b5cf6' }} />,
//     defaultData: { label: 'Alert sales agent', recipient: 'Sales', type: 'notify' },
//   },
//   {
//     type: 'group',
//     label: 'Group',
//     color: '#f1f5f9',
//     icon: <GroupIcon sx={{ color: '#64748b' }} />,
//     defaultData: { label: 'Group', description: '', type: 'group', children: [] },
//   },
// ];

// const BLOCK_TYPE_COLORS: Record<string, string> = {
//   trigger: '#fde047',
//   wait: '#60a5fa',
//   action: '#4ade80',
//   decision: '#f472b6',
//   tag: '#fbbf24',
//   notify: '#a78bfa',
//   group: '#f1f5f9',
// };

// // --- Example Templates ---
// const TEMPLATES = [
//   {
//     name: 'TikTok DM Followup',
//     description: 'TikTok comment → DM → Wait 2h → Auto-call if no reply',
//     nodes: [
//       { id: '1', type: 'custom', position: { x: 120, y: 180 }, data: { ...BLOCK_TYPES[0].defaultData, label: 'TikTok comment: "Want this!"' } },
//       { id: '2', type: 'custom', position: { x: 350, y: 180 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Send DM', channel: 'TikTok', message: 'Hey! Want to learn more?' } },
//       { id: '3', type: 'custom', position: { x: 580, y: 180 }, data: { ...BLOCK_TYPES[1].defaultData, label: 'Wait 2 hours', time: 2, unit: 'hours' } },
//       { id: '4', type: 'custom', position: { x: 820, y: 180 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Auto-call', channel: 'Voice', message: 'Hi! Still interested?' } },
//     ],
//     edges: [
//       { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
//       { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
//       { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
//     ],
//   },
//   {
//     name: 'Cart Abandon Recovery',
//     description: 'Cart abandoned → Wait 30m → WhatsApp + Email → If no click → Tag + Notify',
//     nodes: [
//       { id: '1', type: 'custom', position: { x: 120, y: 180 }, data: { ...BLOCK_TYPES[0].defaultData, label: 'Cart abandoned' } },
//       { id: '2', type: 'custom', position: { x: 350, y: 180 }, data: { ...BLOCK_TYPES[1].defaultData, label: 'Wait 30 mins', time: 30, unit: 'minutes' } },
//       { id: '3', type: 'custom', position: { x: 580, y: 120 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Send WhatsApp', channel: 'WhatsApp', message: 'You left something in your cart!' } },
//       { id: '4', type: 'custom', position: { x: 580, y: 240 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Send Email', channel: 'Email', message: 'Complete your purchase!' } },
//       { id: '5', type: 'custom', position: { x: 820, y: 180 }, data: { ...BLOCK_TYPES[3].defaultData, label: 'If no click', condition: 'No click in 1h' } },
//       { id: '6', type: 'custom', position: { x: 1050, y: 120 }, data: { ...BLOCK_TYPES[4].defaultData, label: 'Tag: Unresponsive', tag: 'unresponsive' } },
//       { id: '7', type: 'custom', position: { x: 1050, y: 240 }, data: { ...BLOCK_TYPES[5].defaultData, label: 'Notify Rep', recipient: 'Sales' } },
//     ],
//     edges: [
//       { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
//       { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
//       { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
//       { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
//       { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
//       { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' },
//       { id: 'e5-7', source: '5', target: '7', type: 'smoothstep' },
//     ],
//   },
//   {
//     name: 'Brochure Download Nurture',
//     description: 'Download brochure → Wait 2d → WhatsApp → If reply "Interested" → Book call',
//     nodes: [
//       { id: '1', type: 'custom', position: { x: 120, y: 180 }, data: { ...BLOCK_TYPES[0].defaultData, label: 'Download brochure' } },
//       { id: '2', type: 'custom', position: { x: 350, y: 180 }, data: { ...BLOCK_TYPES[1].defaultData, label: 'Wait 2 days', time: 2, unit: 'days' } },
//       { id: '3', type: 'custom', position: { x: 580, y: 180 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Send WhatsApp', channel: 'WhatsApp', message: 'Hope you liked the brochure!' } },
//       { id: '4', type: 'custom', position: { x: 820, y: 180 }, data: { ...BLOCK_TYPES[3].defaultData, label: 'If reply "Interested"', condition: 'Reply contains "Interested"' } },
//       { id: '5', type: 'custom', position: { x: 1050, y: 180 }, data: { ...BLOCK_TYPES[2].defaultData, label: 'Book call', channel: 'Voice', message: 'Let\'s book a call!' } },
//     ],
//     edges: [
//       { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
//       { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
//       { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
//       { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
//     ],
//   },
// ];

// // --- Version History Context ---
// type HistoryState = { nodes: Node[]; edges: Edge[] };
// const HistoryContext = createContext<{
//   history: HistoryState[];
//   pointer: number;
//   push: (state: HistoryState) => void;
//   undo: () => void;
//   redo: () => void;
//   canUndo: boolean;
//   canRedo: boolean;
// }>({
//   history: [],
//   pointer: 0,
//   push: () => {},
//   undo: () => {},
//   redo: () => {},
//   canUndo: false,
//   canRedo: false,
// });

// // --- Custom Node ---
// const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
//   return (
//     <Grow in>
//       <Box
//         sx={{
//           p: 2,
//           borderRadius: 3,
//           background: BLOCK_TYPE_COLORS[data.type as keyof typeof BLOCK_TYPE_COLORS] || '#fff',
//           boxShadow: selected ? '0 0 0 3px #6366f1' : '0 2px 8px #6366f122',
//           minWidth: 160,
//           minHeight: 60,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           fontWeight: 700,
//           fontSize: 15,
//           position: 'relative',
//           border: selected ? '2px solid #6366f1' : '2px solid transparent',
//           transition: 'box-shadow 0.2s, border 0.2s',
//           cursor: 'pointer',
//           userSelect: 'none',
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//           {BLOCK_TYPES.find(b => b.type === data.type)?.icon}
//           <span>{data.label}</span>
//         </Box>
//         <Typography fontSize={13} color="#444" fontWeight={500} sx={{ mt: 0.5 }}>
//           {data.description || data.message || data.condition || data.tag || data.recipient || ''}
//         </Typography>
//       </Box>
//     </Grow>
//   );
// };
// const nodeTypes: NodeTypes = { custom: CustomNode };

// // --- Styled Components ---
// const Sidebar = styled(Paper)(({ theme }) => ({
//   width: 90,
//   minHeight: '100%',
//   background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.98)' : 'rgba(255,255,255,0.95)',
//   borderRadius: 24,
//   boxShadow: '0 4px 24px #6366f122',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   gap: theme.spacing(2),
//   padding: theme.spacing(2, 1),
//   position: 'relative',
//   zIndex: 2,
// }));

// const BlockTypeButton = styled(Button)<{ bgcolor: string }>(({ bgcolor, theme }) => ({
//   minWidth: 0,
//   width: 56,
//   height: 56,
//   borderRadius: 16,
//   background: bgcolor,
//   color: '#222',
//   boxShadow: '0 2px 8px #6366f122',
//   marginBottom: theme.spacing(1),
//   fontWeight: 700,
//   fontSize: 13,
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   '&:hover': {
//     background: bgcolor,
//     opacity: 0.85,
//     boxShadow: '0 4px 16px #6366f144',
//     transform: 'scale(1.07)',
//     transition: 'all 0.15s',
//   },
// }));

// const CanvasPanel = styled(Paper)(({ theme }) => ({
//   flex: 1,
//   minHeight: 600,
//   borderRadius: 24,
//   background: theme.palette.mode === 'dark'
//     ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
//     : 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
//   boxShadow: '0 8px 32px #6366f133',
//   overflow: 'hidden',
//   position: 'relative',
// }));

// const ConfigPanel = styled(Paper)(({ theme }) => ({
//   width: 320,
//   minHeight: 600,
//   borderRadius: 24,
//   background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.98)' : 'rgba(255,255,255,0.98)',
//   boxShadow: '0 4px 24px #6366f122',
//   padding: theme.spacing(3),
//   position: 'relative',
//   zIndex: 2,
// }));

// const MetricsPanel = styled(Paper)(({ theme }) => ({
//   width: '100%',
//   borderRadius: 18,
//   background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
//   boxShadow: '0 2px 16px #6366f122',
//   padding: theme.spacing(2, 3),
//   marginTop: theme.spacing(2),
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(4),
//   justifyContent: 'space-between',
// }));

// const AISuggestionBanner = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: 24,
//   left: '50%',
//   transform: 'translateX(-50%)',
//   background: 'linear-gradient(90deg,#6366f1,#fbbf24)',
//   color: '#fff',
//   borderRadius: 16,
//   boxShadow: '0 2px 12px #6366f133',
//   padding: theme.spacing(1.5, 4),
//   fontWeight: 700,
//   fontSize: 17,
//   zIndex: 10,
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(2),
//   animation: 'fadeIn 0.7s',
// }));

// // --- Main Component ---
// const initialNodes: Node[] = [
//   {
//     id: '1',
//     type: 'custom',
//     position: { x: 120, y: 180 },
//     data: { ...BLOCK_TYPES[0].defaultData, label: 'User downloads brochure' },
//   },
// ];
// const initialEdges: Edge[] = [];

// const WorkflowAutomationPage: React.FC = () => {
//   // --- Theme ---
//   const [mode, setMode] = useState<'light' | 'dark'>(
//     window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
//   );
//   const colorMode = useMemo(
//     () => ({ toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')) }),
//     []
//   );
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//           primary: { main: '#6366f1' },
//           secondary: { main: '#fbbf24' },
//           background: {
//             default: mode === 'dark' ? '#1e293b' : '#f8fafc',
//             paper: mode === 'dark' ? '#1e293b' : '#fff',
//           },
//         },
//         typography: {
//           fontFamily: 'Manrope, Inter, sans-serif',
//         },
//       }),
//     [mode]
//   );
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   // --- React Flow State ---
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [aiSuggestion, setAISuggestion] = useState('This flow lacks a follow-up. Add a Wait or Action?');
//   const [showAISuggestion, setShowAISuggestion] = useState(true);
//   const [simulating, setSimulating] = useState(false);
//   const [metrics, setMetrics] = useState({ ctr: 0.42, reply: 0.31, score: 0.88 });
//   const [search, setSearch] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [importAnchor, setImportAnchor] = useState<null | HTMLElement>(null);
//   const [exportedJSON, setExportedJSON] = useState('');
//   const [templateAnchor, setTemplateAnchor] = useState<null | HTMLElement>(null);
//   const [tab, setTab] = useState(0);
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

//   // --- Version History ---
//   const [history, setHistory] = useState<HistoryState[]>([{ nodes, edges }]);
//   const [pointer, setPointer] = useState(0);
//   const canUndo = pointer > 0;
//   const canRedo = pointer < history.length - 1;
//   const pushHistory = (newState: HistoryState) => {
//     const newHistory = history.slice(0, pointer + 1).concat([newState]);
//     setHistory(newHistory);
//     setPointer(newHistory.length - 1);
//   };
//   const undo = () => {
//     if (canUndo) {
//       setPointer(pointer - 1);
//       setNodes(history[pointer - 1].nodes);
//       setEdges(history[pointer - 1].edges);
//     }
//   };
//   const redo = () => {
//     if (canRedo) {
//       setPointer(pointer + 1);
//       setNodes(history[pointer + 1].nodes);
//       setEdges(history[pointer + 1].edges);
//     }
//   };

//   // --- Drag & Drop ---
//   const onDragStart = (event: React.DragEvent, blockType: string) => {
//     event.dataTransfer.setData('application/reactflow', blockType);
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   const onDrop = useCallback(
//     (event: React.DragEvent) => {
//       event.preventDefault();
//       if (!reactFlowWrapper.current || !reactFlowInstance) return;
//       const reactFlowBounds = (reactFlowWrapper.current as HTMLDivElement).getBoundingClientRect();
//       const type = event.dataTransfer.getData('application/reactflow');
//       const block = BLOCK_TYPES.find(b => b.type === type);
//       if (!block) return;
//       const position = reactFlowInstance.project({
//         x: event.clientX - reactFlowBounds.left - 80,
//         y: event.clientY - reactFlowBounds.top - 30,
//       });
//       const newNode: Node = {
//         id: uuidv4(),
//         type: 'custom',
//         position,
//         data: { ...block.defaultData },
//       };
//       setNodes((nds) => nds.concat(newNode));
//       setAISuggestion('AI: Connect this block to an Action or Wait!');
//       setShowAISuggestion(true);
//       pushHistory({ nodes: [...nodes, newNode], edges });
//     },
//     [reactFlowInstance, setNodes, nodes, edges]
//   );

//   const onDragOver = (event: React.DragEvent) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   };

//   // --- Node/Edge Events ---
//   const onConnect = useCallback(
//     (params: any) => {
//       const newEdge = {
//         ...params,
//         type: ConnectionLineType.SmoothStep,
//         markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
//       };
//       setEdges((eds) => addEdge(newEdge, eds));
//       setAISuggestion('AI: You connected two blocks!');
//       setShowAISuggestion(true);
//       pushHistory({ nodes, edges: [...edges, newEdge] });
//     },
//     [setEdges, nodes, edges]
//   );

//   const onNodeClick = (event: any, node: Node) => {
//     setSelectedNode(node);
//   };

//   const onPaneClick = () => {
//     setSelectedNode(null);
//   };

//   // --- Node Duplication ---
//   const duplicateNode = (node: Node) => {
//     const newNode: Node = {
//       ...node,
//       id: uuidv4(),
//       position: { x: node.position.x + 40, y: node.position.y + 40 },
//     };
//     setNodes((nds) => nds.concat(newNode));
//     setAISuggestion('AI: Don\'t forget to connect your duplicated node!');
//     setShowAISuggestion(true);
//     pushHistory({ nodes: [...nodes, newNode], edges });
//   };

//   // --- Node Search ---
//   const filteredNodes = search
//     ? nodes.filter((n) => n.data.label.toLowerCase().includes(search.toLowerCase()))
//     : nodes;

//   // --- Node Delete ---
//   const deleteNode = (nodeId: string) => {
//     setNodes((nds) => nds.filter((n) => n.id !== nodeId));
//     setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
//     setAISuggestion('AI: You removed a block. Need a replacement?');
//     setShowAISuggestion(true);
//     pushHistory({
//       nodes: nodes.filter((n) => n.id !== nodeId),
//       edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
//     });
//   };

//   // --- Config Panel Save ---
//   const handleConfigSave = (updatedData: any) => {
//     if (!selectedNode) return;
//     setNodes((nds) =>
//       nds.map((n) =>
//         n.id === selectedNode.id ? { ...n, data: { ...n.data, ...updatedData } } : n
//       )
//     );
//     setSnackbar({ open: true, message: 'Block updated!', severity: 'success' });
//     pushHistory({
//       nodes: nodes.map((n) =>
//         n.id === selectedNode.id ? { ...n, data: { ...n.data, ...updatedData } } : n
//       ),
//       edges,
//     });
//   };

//   // --- Export/Import ---
//   const handleExport = () => {
//     setExportedJSON(JSON.stringify({ nodes, edges }, null, 2));
//     setSnackbar({ open: true, message: 'Workflow exported as JSON!', severity: 'success' });
//   };
//   const handleImport = (json: string) => {
//     try {
//       const obj = JSON.parse(json);
//       setNodes(obj.nodes);
//       setEdges(obj.edges);
//       setSnackbar({ open: true, message: 'Workflow imported!', severity: 'success' });
//       pushHistory({ nodes: obj.nodes, edges: obj.edges });
//     } catch {
//       setSnackbar({ open: true, message: 'Invalid JSON!', severity: 'error' });
//     }
//   };

//   // --- Simulation ---
//   const handleSimulate = () => {
//     setSimulating(true);
//     setAISuggestion('AI: Simulating workflow...');
//     setTimeout(() => {
//       setSimulating(false);
//       setAISuggestion('AI: Simulation complete! CTR: 42%, Reply: 31%');
//       setShowAISuggestion(true);
//     }, 2000);
//   };

//   // --- AI Suggestion Dismiss ---
//   const dismissAISuggestion = () => setShowAISuggestion(false);

//   // --- Template Load ---
//   const loadTemplate = (templateIdx: number) => {
//     const t = TEMPLATES[templateIdx];
//     setNodes(t.nodes);
//     setEdges(t.edges);
//     setSnackbar({ open: true, message: `Loaded template: ${t.name}`, severity: 'success' });
//     setTemplateAnchor(null);
//     pushHistory({ nodes: t.nodes, edges: t.edges });
//   };

//   // --- Responsive Layout ---
//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <ReactFlowProvider>
//           <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, fontFamily: 'Manrope, Inter, sans-serif', p: { xs: 1, md: 4 } }}>
//             {/* Top Nav */}
//             <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: 4, mb: 2, boxShadow: '0 2px 12px #6366f133' }}>
//               <Toolbar sx={{ gap: 2 }}>
//                 <Timeline sx={{ color: '#6366f1', fontSize: 32, mr: 1 }} />
//                 <Typography variant="h5" fontWeight={800} color="#6366f1" sx={{ flexGrow: 1 }}>
//                   Workflow Automation Engine
//                 </Typography>
//                 <Tooltip title="Undo">
//                   <span>
//                     <IconButton onClick={undo} disabled={!canUndo}><Undo /></IconButton>
//                   </span>
//                 </Tooltip>
//                 <Tooltip title="Redo">
//                   <span>
//                     <IconButton onClick={redo} disabled={!canRedo}><Redo /></IconButton>
//                   </span>
//                 </Tooltip>
//                 <Tooltip title="Templates">
//                   <IconButton onClick={e => setTemplateAnchor(e.currentTarget)}><ViewModule /></IconButton>
//                 </Tooltip>
//                 <Menu anchorEl={templateAnchor} open={!!templateAnchor} onClose={() => setTemplateAnchor(null)}>
//                   <Box sx={{ p: 2, width: 320 }}>
//                     <Typography fontWeight={700} mb={1}>Templates</Typography>
//                     <List>
//                       {TEMPLATES.map((t, idx) => (
//                         <ListItem button key={t.name} onClick={() => loadTemplate(idx)}>
//                           <ListItemIcon><AutoAwesome sx={{ color: '#6366f1' }} /></ListItemIcon>
//                           <ListItemText primary={t.name} secondary={t.description} />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Box>
//                 </Menu>
//                 <Tooltip title="Save">
//                   <IconButton onClick={() => setSnackbar({ open: true, message: 'Workflow saved!', severity: 'success' })}><Save /></IconButton>
//                 </Tooltip>
//                 <Tooltip title="Publish">
//                   <IconButton onClick={() => setSnackbar({ open: true, message: 'Workflow published!', severity: 'success' })}><Publish /></IconButton>
//                 </Tooltip>
//                 <Tooltip title="Preview">
//                   <IconButton onClick={handleSimulate}><Preview /></IconButton>
//                 </Tooltip>
//                 <Tooltip title="Export JSON">
//                   <IconButton onClick={handleExport}><Download /></IconButton>
//                 </Tooltip>
//                 <Tooltip title="Import JSON">
//                   <IconButton onClick={e => setImportAnchor(e.currentTarget)}><Upload /></IconButton>
//                 </Tooltip>
//                 <Menu anchorEl={importAnchor} open={!!importAnchor} onClose={() => setImportAnchor(null)}>
//                   <Box sx={{ p: 2, width: 320 }}>
//                     <Typography fontWeight={700} mb={1}>Paste Workflow JSON</Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       minRows={4}
//                       maxRows={8}
//                       placeholder="Paste JSON here..."
//                       onBlur={e => handleImport(e.target.value)}
//                     />
//                   </Box>
//                 </Menu>
//                 <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
//                   <IconButton onClick={colorMode.toggleColorMode}>
//                     {mode === 'dark' ? <LightMode /> : <DarkMode />}
//                   </IconButton>
//                 </Tooltip>
//               </Toolbar>
//             </AppBar>
//             <Grid container spacing={2}>
//               {/* Sidebar: Block Types */}
//               <Grid item xs={12} md={1}>
//                 <Sidebar>
//                   {BLOCK_TYPES.map((block) => (
//                     <Tooltip key={block.type} title={block.label} placement="right">
//                       <BlockTypeButton
//                         bgcolor={block.color}
//                         draggable
//                         onDragStart={e => onDragStart(e, block.type)}
//                       >
//                         {block.icon}
//                         <span style={{ fontSize: 12 }}>{block.label}</span>
//                       </BlockTypeButton>
//                     </Tooltip>
//                   ))}
//                   <Divider sx={{ my: 2 }} />
//                   <TextField
//                     size="small"
//                     placeholder="Search nodes"
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     InputProps={{ startAdornment: <Search sx={{ color: '#6366f1' }} /> }}
//                     sx={{ borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#f3f4f6', fontWeight: 500, width: '100%' }}
//                   />
//                 </Sidebar>
//               </Grid>
//               {/* Canvas: React Flow */}
//               <Grid item xs={12} md={8}>
//                 <CanvasPanel ref={reactFlowWrapper} sx={{ height: isMobile ? 500 : 700, position: 'relative' }}>
//                   {showAISuggestion && (
//                     <Slide direction="down" in={showAISuggestion} mountOnEnter unmountOnExit>
//                       <AISuggestionBanner>
//                         <EmojiObjects sx={{ fontSize: 28 }} />
//                         {aiSuggestion}
//                         <Button size="small" variant="contained" sx={{ ml: 2, bgcolor: '#fff', color: '#6366f1', fontWeight: 700, borderRadius: 2 }} onClick={dismissAISuggestion}>Dismiss</Button>
//                       </AISuggestionBanner>
//                     </Slide>
//                   )}
//                   <ReactFlow
//                     nodes={filteredNodes}
//                     edges={edges}
//                     onNodesChange={onNodesChange}
//                     onEdgesChange={onEdgesChange}
//                     onConnect={onConnect}
//                     onNodeClick={onNodeClick}
//                     onPaneClick={onPaneClick}
//                     nodeTypes={nodeTypes}
//                     fitView
//                     onInit={setReactFlowInstance}
//                     onDrop={onDrop}
//                     onDragOver={onDragOver}
//                     connectionLineType={ConnectionLineType.SmoothStep}
//                     style={{ borderRadius: 24, background: 'transparent', minHeight: 500 }}
//                     panOnScroll
//                     zoomOnScroll
//                     panOnDrag
//                     snapToGrid
//                     snapGrid={[16, 16]}
//                   >
//                     <MiniMap
//                       nodeColor={(n: any) => BLOCK_TYPE_COLORS[n.data.type as keyof typeof BLOCK_TYPE_COLORS] || '#6366f1'}
//                       nodeStrokeWidth={3}
//                       style={{ borderRadius: 8 }}
//                     />
//                     <Controls showInteractive={false} />
//                     <Background gap={16} color={theme.palette.mode === 'dark' ? '#334155' : '#e0e7ff'} />
//                   </ReactFlow>
//                   {/* Simulation/Playback Mode */}
//                   {simulating && (
//                     <Box sx={{ mt: 2, p: 3, borderRadius: 4, bgcolor: theme.palette.background.paper, boxShadow: '0 2px 12px #6366f133', display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <CircularProgress size={28} sx={{ color: '#6366f1' }} />
//                       <Typography fontWeight={700} color="#6366f1">Simulating workflow...</Typography>
//                     </Box>
//                   )}
//                   {/* Exported JSON Dialog */}
//                   {exportedJSON && (
//                     <Drawer anchor="right" open={!!exportedJSON} onClose={() => setExportedJSON('')}>
//                       <Box sx={{ width: 400, p: 3 }}>
//                         <Typography fontWeight={700} mb={2}>Exported Workflow JSON</Typography>
//                         <TextField
//                           fullWidth
//                           multiline
//                           minRows={10}
//                           maxRows={20}
//                           value={exportedJSON}
//                           InputProps={{ readOnly: true }}
//                         />
//                         <Button
//                           variant="contained"
//                           sx={{ mt: 2, bgcolor: '#6366f1' }}
//                           onClick={() => {
//                             navigator.clipboard.writeText(exportedJSON);
//                             setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
//                           }}
//                         >Copy</Button>
//                       </Box>
//                     </Drawer>
//                   )}
//                 </CanvasPanel>
//               </Grid>
//               {/* Config Panel: Node Properties */}
//               <Grid item xs={12} md={3}>
//                 <ConfigPanel>
//                   {selectedNode ? (
//                     <>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                         {BLOCK_TYPES.find(b => b.type === selectedNode.data.type)?.icon}
//                         <Typography fontWeight={700} fontSize={18}>{selectedNode.data.label}</Typography>
//                         <Box sx={{ flexGrow: 1 }} />
//                         <Tooltip title="Duplicate">
//                           <IconButton onClick={() => duplicateNode(selectedNode)}><ContentCopy /></IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <IconButton onClick={() => deleteNode(selectedNode.id)}><Delete color="error" /></IconButton>
//                         </Tooltip>
//                       </Box>
//                       <Divider sx={{ mb: 2 }} />
//                       {/* Block property fields */}
//                       {Object.keys(selectedNode.data).map((key) => (
//                         key !== 'type' && key !== 'children' && (
//                           <TextField
//                             key={key}
//                             label={key.charAt(0).toUpperCase() + key.slice(1)}
//                             value={selectedNode.data[key]}
//                             onChange={e => handleConfigSave({ [key]: e.target.value })}
//                             sx={{ mb: 2, width: '100%' }}
//                             size="small"
//                           />
//                         )
//                       ))}
//                       <Button
//                         variant="contained"
//                         sx={{ bgcolor: '#6366f1', fontWeight: 700, borderRadius: 2, mt: 2 }}
//                         onClick={() => handleConfigSave(selectedNode.data)}
//                       >Save</Button>
//                     </>
//                   ) : (
//                     <Box sx={{ textAlign: 'center', mt: 8 }}>
//                       <Info sx={{ color: '#6366f1', fontSize: 48, mb: 2 }} />
//                       <Typography fontWeight={700} color="#6366f1">Select a block to configure</Typography>
//                     </Box>
//                   )}
//                 </ConfigPanel>
//                 {/* Metrics Panel */}
//                 <MetricsPanel>
//                   <Box>
//                     <Typography fontWeight={700} color="#6366f1">CTR</Typography>
//                     <Typography fontWeight={800} fontSize={22}>{Math.round(metrics.ctr * 100)}%</Typography>
//                     <LinearProgress variant="determinate" value={metrics.ctr * 100} sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
//                   </Box>
//                   <Box>
//                     <Typography fontWeight={700} color="#22c55e">Reply Rate</Typography>
//                     <Typography fontWeight={800} fontSize={22}>{Math.round(metrics.reply * 100)}%</Typography>
//                     <LinearProgress variant="determinate" value={metrics.reply * 100} sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#22c55e' } }} />
//                   </Box>
//                   <Box>
//                     <Typography fontWeight={700} color="#fbbf24">Automation Score</Typography>
//                     <Typography fontWeight={800} fontSize={22}>{Math.round(metrics.score * 100)}%</Typography>
//                     <LinearProgress variant="determinate" value={metrics.score * 100} sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
//                   </Box>
//                 </MetricsPanel>
//               </Grid>
//             </Grid>
//             {/* Snackbar */}
//             <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
//               <Alert severity={snackbar.severity as 'success' | 'info' | 'warning' | 'error'} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
//             </Snackbar>
//           </Box>
//         </ReactFlowProvider>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// };

// export default WorkflowAutomationPage;

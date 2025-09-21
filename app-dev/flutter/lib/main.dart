import 'package:flutter/material.dart';

// Combined imports
import 'workshop.dart';
import 'lab.dart';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demos',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
      ),
      themeMode: ThemeMode.system,
      home: const DemosGridPage(),
    );
  }
}

class DemoItem {
  final String name;
  final Widget widget;
  final String emoji;
  final String category;

  DemoItem({
    required this.name,
    required this.widget,
    required this.emoji,
    required this.category,
  });
}

class DemosGridPage extends StatefulWidget {
  const DemosGridPage({super.key});

  @override
  State<DemosGridPage> createState() => _DemosGridPageState();
}

class _DemosGridPageState extends State<DemosGridPage> {
  bool isSearching = false;
  String searchText = '';

  final List<DemoItem> demoItems = [
    // Workshop demos
    DemoItem(name: 'workshop.dart', widget: Workshop(), emoji: "🛠️", category: "Workshop"),
    DemoItem(name: 'lab.dart', widget: Lab(), emoji: "🔬", category: "Lab"),
  ];

  @override
  Widget build(BuildContext context) {
    final filteredItems = demoItems
        .where((item) => item.name.toLowerCase().contains(searchText.toLowerCase()) ||
            item.category.toLowerCase().contains(searchText.toLowerCase()))
        .toList();

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: isSearching
            ? TextField(
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Search demos...',
                  border: InputBorder.none,
                ),
                style: const TextStyle(color: Colors.white),
                onChanged: (value) {
                  setState(() => searchText = value);
                },
              )
            : const Text(
                'Flutter Demos',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        actions: [
          IconButton(
            icon: Icon(isSearching ? Icons.close : Icons.search),
            onPressed: () {
              setState(() {
                isSearching = !isSearching;
                searchText = '';
              });
            },
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.deepPurple.shade300,
              Colors.purple.shade200,
              Colors.pink.shade200,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Available Demos',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        blurRadius: 4,
                        color: Colors.black26,
                        offset: Offset(0, 2),),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tap on a demo to open it',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.9),
                    shadows: const [
                      Shadow(
                        blurRadius: 2,
                        color: Colors.black12,
                        offset: Offset(0, 1),),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Expanded(
                  child: filteredItems.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.search_off,
                                size: 64,
                                color: Colors.white.withOpacity(0.7),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No demos found',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white.withOpacity(0.9),
                                ),
                              ),
                            ],
                          ),
                        )
                      : GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                            childAspectRatio: 0.9,
                          ),
                          itemCount: filteredItems.length,
                          itemBuilder: (context, index) {
                            final item = filteredItems[index];
                            return DemoCard(
                              item: item,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => item.widget),
                                );
                              },
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class DemoCard extends StatelessWidget {
  final DemoItem item;
  final VoidCallback onTap;

  const DemoCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.9),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              splashColor: Colors.deepPurple.withOpacity(0.3),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.deepPurple.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item.category,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.deepPurple,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Hero(
                      tag: 'emoji_${item.name}',
                      child: Text(
                        item.emoji,
                        style: const TextStyle(fontSize: 56),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      item.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}